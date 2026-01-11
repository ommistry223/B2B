# 🚀 Performance Optimized Deployment Checklist

## Pre-Deployment Steps

### 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Install New Performance Dependencies

```bash
npm install --save-dev rollup-plugin-visualizer
```

### 3. Build & Test Locally

```bash
# Build production version
npm run build

# Preview production build
npm run serve
```

### 4. Analyze Bundle Size (Optional)

```bash
npm run build:analyze
```

## Deployment to Netlify

### 1. Push Changes to Git

```bash
git add .
git commit -m "feat: comprehensive performance optimizations"
git push origin main
```

### 2. Verify Netlify Configuration

- ✅ Build command: `npm install --legacy-peer-deps && npm run build`
- ✅ Publish directory: `build`
- ✅ Environment variables: `VITE_API_URL` set correctly

### 3. Deploy

Netlify will automatically deploy when you push to main branch.

### 4. Post-Deployment Verification

#### A. Test Core Functionality

- [ ] Login/Register works
- [ ] Dashboard loads correctly
- [ ] API calls successful (no CORS errors)
- [ ] Navigation between pages smooth
- [ ] Mobile responsive design intact

#### B. Check Performance

1. Open [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter your Netlify URL
3. Run both Mobile and Desktop tests
4. Target Scores:
   - Mobile: 90+ ✅
   - Desktop: 95+ ✅

#### C. Verify Console Errors

1. Open Chrome DevTools (F12)
2. Check Console tab
3. Verify:
   - [ ] No CORS errors
   - [ ] No "Unknown message type" errors
   - [ ] No ERR_FAILED errors
   - [ ] Only expected logs in development

#### D. Test Caching

1. Open Network tab in DevTools
2. Reload page (Ctrl+R)
3. Check cache headers:
   - [ ] JS/CSS: `max-age=31536000, immutable`
   - [ ] Images: `max-age=31536000, immutable`
   - [ ] HTML: `max-age=300, must-revalidate`

## Performance Metrics to Monitor

### Core Web Vitals

| Metric                         | Target  | Good |
| ------------------------------ | ------- | ---- |
| LCP (Largest Contentful Paint) | < 2.5s  | ✅   |
| FID (First Input Delay)        | < 100ms | ✅   |
| CLS (Cumulative Layout Shift)  | < 0.1   | ✅   |

### PageSpeed Scores

| Device  | Before | Target | Current |
| ------- | ------ | ------ | ------- |
| Mobile  | 62     | 90+    | \_\_\_  |
| Desktop | 92     | 95+    | \_\_\_  |

## Troubleshooting

### Issue: Build fails on Netlify

**Solution:**

```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Issue: CORS errors persist

**Solution:**

1. Verify backend CORS configuration
2. Check `Access-Control-Allow-Origin` headers
3. Ensure API URL is correct in environment variables
4. Redeploy backend if needed

### Issue: Performance not improved

**Solution:**

1. Clear browser cache
2. Test in incognito mode
3. Verify build generated optimized chunks
4. Check network throttling in DevTools
5. Run `npm run build:analyze` to inspect bundle

### Issue: Service Worker not registering

**Solution:**

1. Ensure HTTPS (required for SW)
2. Check `public/sw.js` exists
3. Verify SW registration in browser DevTools > Application > Service Workers

## Backend Deployment (Railway)

### 1. Push Backend Changes

```bash
cd backend
git add server.js
git commit -m "fix: improve CORS configuration"
git push
```

### 2. Verify Backend Health

```bash
curl https://b2b-production-febe.up.railway.app/api/health
```

Expected response:

```json
{
  "status": "OK",
  "message": "B2B Backend API is running",
  "timestamp": "2026-01-11T..."
}
```

## Monitoring & Maintenance

### Daily Checks

- [ ] Monitor error logs in Netlify
- [ ] Check uptime status
- [ ] Review performance metrics

### Weekly Tasks

- [ ] Run PageSpeed Insights
- [ ] Check bundle size growth
- [ ] Review console errors in production

### Monthly Tasks

- [ ] Update dependencies
- [ ] Security audit (`npm audit`)
- [ ] Performance budget review
- [ ] User feedback analysis

## Rollback Plan

If deployment causes issues:

1. **Immediate Rollback** (Netlify):

   - Go to Netlify Dashboard
   - Click "Deploys"
   - Select previous working deployment
   - Click "Publish deploy"

2. **Revert Code Changes**:

   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Restore Previous Build**:
   ```bash
   git checkout <previous-commit-hash>
   npm run build
   ```

## Success Criteria

✅ **Performance**

- Mobile PageSpeed: 90+
- Desktop PageSpeed: 95+
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

✅ **Functionality**

- All features working
- No console errors
- API calls successful
- Mobile responsive

✅ **User Experience**

- Fast page loads
- Smooth navigation
- Clear feedback
- No visual glitches

## Next Steps After Deployment

1. **Monitor Performance**

   - Set up performance monitoring
   - Track Web Vitals
   - Monitor error rates

2. **Gather Feedback**

   - Test with real users
   - Collect performance data
   - Address any issues

3. **Continuous Optimization**

   - Review bundle size monthly
   - Update dependencies regularly
   - Implement new optimizations

4. **Documentation**
   - Update team on changes
   - Document any issues
   - Share performance wins

## Support & Resources

- [Performance Optimization Guide](PERFORMANCE_OPTIMIZATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Netlify Docs](https://docs.netlify.com/)
- [Web.dev Performance](https://web.dev/performance/)

---

**Deployment Date**: ******\_******
**Deployed By**: ******\_******
**Performance Verified**: ☐
**All Tests Passing**: ☐
**Production Ready**: ☐
