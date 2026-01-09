import React from 'react'
import Icon from '../../../components/AppIcon'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const LineItemTable = ({
  items,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  gstRate,
}) => {
  const calculateItemTotal = item => {
    const subtotal = item?.quantity * item?.rate
    const taxAmount = (subtotal * gstRate) / 100
    return subtotal + taxAmount
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Line Items</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
          onClick={onAddItem}
        >
          Add Item
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase">
                Description
              </th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground uppercase min-w-[100px]">
                Quantity
              </th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground uppercase min-w-[120px]">
                Rate (₹)
              </th>
              <th className="text-right py-3 px-2 text-xs font-medium text-muted-foreground uppercase min-w-[120px]">
                Amount (₹)
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => (
              <tr key={item?.id} className="border-b border-border">
                <td className="py-3 px-2">
                  <Input
                    type="text"
                    placeholder="Item description"
                    value={item?.description}
                    onChange={e =>
                      onUpdateItem(index, 'description', e?.target?.value)
                    }
                    className="min-w-[200px]"
                  />
                </td>
                <td className="py-3 px-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={item?.quantity}
                    onChange={e =>
                      onUpdateItem(
                        index,
                        'quantity',
                        parseFloat(e?.target?.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="py-3 px-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={item?.rate}
                    onChange={e =>
                      onUpdateItem(
                        index,
                        'rate',
                        parseFloat(e?.target?.value) || 0
                      )
                    }
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm font-semibold text-foreground data-text">
                    {calculateItemTotal(item)?.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="py-3 px-2">
                  {items?.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Trash2"
                      iconSize={16}
                      onClick={() => onRemoveItem(index)}
                      className="text-error hover:text-error"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items?.length === 0 && (
        <div className="text-center py-8 border border-dashed border-border rounded-lg">
          <Icon
            name="Package"
            size={48}
            color="var(--color-muted-foreground)"
            className="mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground">No items added yet</p>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            onClick={onAddItem}
            className="mt-3"
          >
            Add First Item
          </Button>
        </div>
      )}
    </div>
  )
}

export default LineItemTable
