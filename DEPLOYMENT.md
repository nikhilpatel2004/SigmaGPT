# Deployment Guide

## Production Checklist

### Backend Deployment

1. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Add MongoDB connection string
   - Add OpenAI API key
   - Set `NODE_ENV=production`
   - Set `FRONTEND_URL` to your frontend domain

2. **Deploy to Railway/Render**
   ```bash
   cd Backend
   git init
   git add .
   git commit -m "Initial commit"
   # Connect to Railway/Render and push
   ```

3. **Environment Variables (Set in platform)**
   - `MONGODB_URI`
   - `OPENAI_API_KEY`
   - `PORT` (usually auto-set)
   - `NODE_ENV=production`
   - `FRONTEND_URL`

### Frontend Deployment

1. **Environment Setup**
   - Copy `.env.example` to `.env.production`
   - Set `VITE_API_URL` to your backend URL
   - Add all Firebase credentials

2. **Build Production**
   ```bash
   cd fronted
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

   Or **Deploy to Netlify**
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

### Post-Deployment

1. **Test API Connection**
   - Visit `https://your-backend.com/health`
   - Should return `{"status":"OK"}`

2. **Update CORS**
   - Add your frontend domain to backend CORS configuration

3. **Monitor Logs**
   - Check backend logs for errors
   - Monitor MongoDB connections
   - Track API usage

### Security Checklist

- [ ] All `.env` files in `.gitignore`
- [ ] No hardcoded API keys in code
- [ ] CORS configured with specific origins
- [ ] HTTPS enabled on both frontend/backend
- [ ] MongoDB IP whitelist configured
- [ ] Rate limiting enabled (recommended)
- [ ] Firebase rules configured properly

### Performance Optimization

- [ ] Frontend assets minified
- [ ] Images optimized
- [ ] Code splitting enabled (Vite default)
- [ ] CDN configured (optional)
- [ ] MongoDB indexes created
- [ ] Backend response caching (optional)

## Recommended Platforms

### Backend
- **Railway** - Easy Node.js deployment
- **Render** - Free tier available
- **Heroku** - Classic choice
- **AWS EC2** - Full control

### Frontend
- **Vercel** - Best for React/Vite
- **Netlify** - Great free tier
- **Firebase Hosting** - Good with Firebase Auth
- **AWS S3 + CloudFront** - Scalable

### Database
- **MongoDB Atlas** - Free tier available
- **Railway MongoDB** - Integrated with Railway

## Troubleshooting

### Backend Issues
- Check logs: `npm start` should show connection status
- Test MongoDB: Connection string format correct?
- CORS errors: Frontend URL added to CORS config?

### Frontend Issues
- API calls failing: Check `VITE_API_URL` in `.env`
- Auth not working: Verify Firebase config
- Build errors: Run `npm run build` locally first

## Monitoring

1. **Backend Health**
   ```bash
   curl https://your-backend.com/health
   ```

2. **Frontend Build**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

3. **Database**
   - Monitor MongoDB Atlas dashboard
   - Check connection count
   - Review slow queries

## Cost Estimation

### Free Tier (Hobby Projects)
- Frontend: Vercel/Netlify (Free)
- Backend: Render/Railway ($0-5/mo)
- Database: MongoDB Atlas (Free 512MB)
- Total: $0-5/month

### Production (Small Scale)
- Frontend: Vercel Pro ($20/mo)
- Backend: Railway Pro ($5-20/mo)
- Database: MongoDB Atlas ($9-25/mo)
- Total: $34-65/month

---

Need help? Check the main README.md or create an issue.
