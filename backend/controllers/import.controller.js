import { XMLParser } from 'fast-xml-parser';
import { db } from '../services/database.postgresql.js';
import { ApiError } from '../middleware/errorHandler.js';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: false,
  trimValues: true,
});

const toArray = value => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const getText = value => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim();
  }
  if (typeof value === 'object' && value['#text'] !== undefined) {
    return String(value['#text']).trim();
  }
  return '';
};

const parseNumber = value => {
  if (value === undefined || value === null) return null;
  const cleaned = String(value).replace(/,/g, '').trim();
  if (!cleaned) return null;
  const number = parseFloat(cleaned);
  return Number.isNaN(number) ? null : number;
};

const parseQuantity = value => {
  const number = parseNumber(String(value).split(' ')[0]);
  return Number.isNaN(number) || number === null ? 0 : number;
};

const parseDate = value => {
  const raw = getText(value);
  if (!raw) return null;
  const trimmed = raw.trim();

  if (/^\d{8}$/.test(trimmed)) {
    return `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`;
  }

  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('-');
    return `${year}-${month}-${day}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split('/');
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split('T')[0];
};

const collectNodes = (obj, key, acc = []) => {
  if (!obj || typeof obj !== 'object') return acc;
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    acc.push(...toArray(obj[key]));
  }
  Object.values(obj).forEach(value => {
    if (value && typeof value === 'object') {
      collectNodes(value, key, acc);
    }
  });
  return acc;
};

const extractAddress = ledger => {
  const addressList = ledger?.['ADDRESS.LIST'];
  const addresses = [];

  toArray(addressList).forEach(entry => {
    if (entry?.ADDRESS) {
      toArray(entry.ADDRESS).forEach(addr => {
        const text = getText(addr);
        if (text) addresses.push(text);
      });
    } else {
      const text = getText(entry);
      if (text) addresses.push(text);
    }
  });

  return addresses.filter(Boolean).join(', ');
};

const parseVoucherItems = voucher => {
  const items = [];

  const inventoryLists = [
    ...toArray(voucher?.['INVENTORYENTRIES.LIST']),
    ...toArray(voucher?.['ALLINVENTORYENTRIES.LIST']),
  ];

  inventoryLists.forEach(entry => {
    const description =
      getText(entry?.STOCKITEMNAME) ||
      getText(entry?.LEDGERNAME) ||
      getText(entry?.ITEMNAME) ||
      'Item';

    const quantity =
      parseQuantity(entry?.BILLEDQTY) ||
      parseQuantity(entry?.ACTUALQTY) ||
      1;

    const amount = Math.abs(parseNumber(entry?.AMOUNT) || 0);
    const rate =
      parseNumber(entry?.RATE) ||
      (quantity ? parseFloat((amount / quantity).toFixed(2)) : amount);

    items.push({
      description,
      quantity,
      rate: rate || 0,
    });
  });

  return items;
};

const calculateVoucherTotal = voucher => {
  const items = parseVoucherItems(voucher);
  const itemTotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );

  if (itemTotal > 0) {
    return { total: itemTotal, items };
  }

  const ledgerEntries = [
    ...toArray(voucher?.['ALLLEDGERENTRIES.LIST']),
    ...toArray(voucher?.['LEDGERENTRIES.LIST']),
  ];

  let total = 0;
  ledgerEntries.forEach(entry => {
    const amount = parseNumber(entry?.AMOUNT);
    if (amount === null) return;
    const isPositive = getText(entry?.ISDEEMEDPOSITIVE).toLowerCase() === 'no';
    if (isPositive) {
      total += Math.abs(amount);
    }
  });

  if (total === 0) {
    ledgerEntries.forEach(entry => {
      const amount = parseNumber(entry?.AMOUNT);
      if (amount === null) return;
      total += Math.abs(amount);
    });
  }

  return { total, items };
};

export const importTallyXml = async (req, res, next) => {
  try {
    const importType = (req.body?.importType || 'both').toLowerCase();
    const xml =
      req.file?.buffer?.toString('utf8') ||
      req.body?.xml ||
      req.body?.data ||
      '';

    if (!xml.trim()) {
      throw new ApiError('No XML file provided', 400);
    }

    const parsed = parser.parse(xml);
    const ledgers = collectNodes(parsed, 'LEDGER');
    const vouchers = collectNodes(parsed, 'VOUCHER');

    const summary = {
      customers: { created: 0, updated: 0, skipped: 0 },
      invoices: { created: 0, updated: 0, skipped: 0 },
      errors: [],
    };

    const existingCustomers = await db.getCustomersByUserId(req.user.userId);
    const customerMap = new Map(
      existingCustomers.map(c => [c.name?.toLowerCase(), c])
    );

    const touchedCustomerIds = new Set();

    if (importType === 'customers' || importType === 'both') {
      for (const ledger of ledgers) {
        const name = getText(ledger?.NAME);
        if (!name) {
          summary.customers.skipped += 1;
          continue;
        }

        const parent = getText(ledger?.PARENT).toLowerCase();
        const isCustomerLedger =
          parent.includes('sundry debtors') ||
          parent.includes('trade debtors') ||
          getText(ledger?.ISBILLWISEON).toLowerCase() === 'yes';

        const hasContactInfo =
          getText(ledger?.GSTIN) ||
          getText(ledger?.GSTREGISTRATIONNUMBER) ||
          getText(ledger?.EMAIL) ||
          getText(ledger?.PHONE) ||
          getText(ledger?.MOBILE);

        if (!isCustomerLedger && !hasContactInfo) {
          summary.customers.skipped += 1;
          continue;
        }

        const customerData = {
          name,
          email: getText(ledger?.EMAIL) || null,
          phone: getText(ledger?.PHONE) || getText(ledger?.MOBILE) || null,
          gst:
            getText(ledger?.GSTIN) ||
            getText(ledger?.GSTREGISTRATIONNUMBER) ||
            null,
          address: extractAddress(ledger),
          creditLimit: parseNumber(ledger?.CREDITLIMIT) || 0,
          paymentTerms: parseNumber(ledger?.PAYMENTTERMS) || 30,
          riskScore: 'low',
          outstanding: 0,
        };

        const existing = customerMap.get(name.toLowerCase());
        if (existing) {
          const updates = {};
          Object.keys(customerData).forEach(key => {
            if (customerData[key] !== null && customerData[key] !== '') {
              updates[key] = customerData[key];
            }
          });

          if (Object.keys(updates).length > 0) {
            const updated = await db.updateCustomer(
              existing.id,
              req.user.userId,
              updates
            );
            customerMap.set(name.toLowerCase(), updated);
            summary.customers.updated += 1;
          } else {
            summary.customers.skipped += 1;
          }
        } else {
          const created = await db.createCustomer(req.user.userId, customerData);
          customerMap.set(name.toLowerCase(), created);
          summary.customers.created += 1;
        }
      }
    }

    if (importType === 'invoices' || importType === 'both') {
      for (let index = 0; index < vouchers.length; index += 1) {
        const voucher = vouchers[index];

        const isCancelled =
          getText(voucher?.ISCANCELLED).toLowerCase() === 'yes' ||
          getText(voucher?.ISDELETED).toLowerCase() === 'yes';
        if (isCancelled) {
          summary.invoices.skipped += 1;
          continue;
        }

        const voucherType = getText(
          voucher?.VOUCHERTYPENAME || voucher?.VOUCHERTYPE
        ).toLowerCase();

        const isInvoice =
          voucherType.includes('sales') ||
          voucherType.includes('invoice') ||
          getText(voucher?.ISINVOICE).toLowerCase() === 'yes';

        if (!isInvoice) {
          summary.invoices.skipped += 1;
          continue;
        }

        const customerName =
          getText(voucher?.PARTYNAME) || getText(voucher?.PARTYLEDGERNAME);
        if (!customerName) {
          summary.invoices.skipped += 1;
          continue;
        }

        const invoiceNumber =
          getText(voucher?.VOUCHERNUMBER) ||
          getText(voucher?.REFERENCE) ||
          `TALLY-${index + 1}`;

        const invoiceDate = parseDate(voucher?.DATE) || new Date().toISOString().split('T')[0];
        const dueDate = parseDate(voucher?.DUEDATE) || invoiceDate;

        const { total, items } = calculateVoucherTotal(voucher);
        if (!total || total <= 0) {
          summary.invoices.skipped += 1;
          continue;
        }

        let customer = customerMap.get(customerName.toLowerCase());
        if (!customer) {
          customer = await db.createCustomer(req.user.userId, {
            name: customerName,
            email: null,
            phone: null,
            gst: null,
            address: '',
            creditLimit: 0,
            paymentTerms: 30,
            riskScore: 'low',
            outstanding: 0,
          });
          customerMap.set(customerName.toLowerCase(), customer);
          summary.customers.created += 1;
        }

        const existingInvoice = await db.getInvoiceByNumber(
          req.user.userId,
          invoiceNumber
        );

        if (existingInvoice) {
          await db.updateInvoice(existingInvoice.id, req.user.userId, {
            customerId: customer.id,
            customerName,
            amount: total,
            dueDate,
            items,
            notes: getText(voucher?.NARRATION) || existingInvoice.notes,
          });
          summary.invoices.updated += 1;
        } else {
          await db.createInvoice(req.user.userId, {
            invoiceNumber,
            customerId: customer.id,
            customerName,
            amount: total,
            dueDate,
            items,
            notes: getText(voucher?.NARRATION),
            status: 'pending',
            paidAmount: 0,
          });
          summary.invoices.created += 1;
        }

        touchedCustomerIds.add(customer.id);
      }
    }

    for (const customerId of touchedCustomerIds) {
      await db.recalculateCustomerOutstanding(customerId, req.user.userId);
    }

    res.json({
      message: 'Tally import completed',
      summary,
    });
  } catch (error) {
    next(error);
  }
};
