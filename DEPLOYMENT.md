# 🚀 Deployment Guide

Complete guide to deploy your Video Earning App to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- Stripe account (for payment processing)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `video-earning-app`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire content from `database/schema.sql`
4. Paste and click "Run"
5. Verify tables are created in **Table Editor**

### 1.3 Get API Keys

1. Go to **Settings** > **API**
2. Copy these values:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (keep this secure!)

### 1.4 Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set **Site URL** to your domain (or `http://localhost:3000` for testing)

## Step 2: Set Up Stripe

### 2.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Sign up for an account
3. Complete business verification

### 2.2 Get API Keys

1. Go to **Developers** > **API Keys**
2. Copy:
   - Publishable key (starts with `pk_`)
   - Secret key (starts with `sk_`)
3. For testing, use **Test mode** keys

### 2.3 Configure Webhooks (Optional)

1. Go to **Developers** > **Webhooks**
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen to
4. Copy webhook signing secret

## Step 3: Deploy to Vercel

### 3.1 Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 3.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 3.3 Add Environment Variables

In Vercel project settings, add these environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# JWT Secret (generate a random string)
JWT_SECRET=your_random_32_character_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
DAILY_VIDEO_LIMIT=30
VIDEO_EARNING_AMOUNT=0.5
MINIMUM_WITHDRAWAL=5
PKR_EXCHANGE_RATE=278.5
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at `https://your-app.vercel.app`

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Site URL

1. Go to Supabase **Authentication** > **URL Configuration**
2. Set **Site URL** to your Vercel domain
3. Add **Redirect URLs**: `https://your-app.vercel.app/**`

### 4.2 Test the Application

1. Visit your deployed app
2. Create a test account
3. Try watching a video
4. Test withdrawal flow

### 4.3 Add Real Video Content

Update videos in Supabase:

```sql
-- Update video URLs with real content
UPDATE videos 
SET video_url = 'https://your-real-video-url.mp4',
    thumbnail_url = 'https://your-real-thumbnail.jpg'
WHERE id = 'video-id';
```

## Step 5: Custom Domain (Optional)

### 5.1 Add Domain in Vercel

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 5.2 Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to your custom domain.

## Step 6: Monitoring & Maintenance

### 6.1 Set Up Monitoring

- Enable Vercel Analytics
- Set up Supabase monitoring
- Configure error tracking (Sentry recommended)

### 6.2 Database Backups

1. Go to Supabase **Database** > **Backups**
2. Enable automatic backups
3. Schedule regular backups

### 6.3 Update Exchange Rates

Regularly update PKR exchange rate:

```bash
# Update in Vercel environment variables
PKR_EXCHANGE_RATE=280.5
```

Then redeploy the application.

## Troubleshooting

### Build Fails

- Check all environment variables are set
- Verify Node.js version (18+)
- Check build logs for specific errors

### Authentication Issues

- Verify Supabase URL and keys
- Check Site URL configuration
- Ensure JWT_SECRET is set

### Database Connection Errors

- Verify Supabase project is active
- Check RLS policies are enabled
- Ensure service role key is correct

### Video Playback Issues

- Verify video URLs are accessible
- Check CORS configuration
- Ensure video format is supported

## Security Checklist

- [ ] All environment variables are set
- [ ] Service role key is kept secret
- [ ] JWT secret is random and secure
- [ ] RLS policies are enabled
- [ ] HTTPS is enforced
- [ ] Rate limiting is configured
- [ ] Input validation is in place
- [ ] SQL injection prevention is active

## Performance Optimization

### Enable Caching

```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' }
      ]
    }
  ]
}
```

### Database Indexing

Indexes are already created in schema.sql. Monitor query performance in Supabase.

### CDN Configuration

Vercel automatically provides CDN. For videos, consider:
- AWS CloudFront
- Cloudflare
- Bunny CDN

## Scaling Considerations

### Database

- Monitor connection pool usage
- Consider read replicas for high traffic
- Implement database connection pooling

### API Rate Limiting

Implement rate limiting for API routes:

```typescript
// middleware.ts
import { rateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  const limiter = rateLimit({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  });
  
  await limiter.check(request, 10); // 10 requests per minute
}
```

### Video Delivery

For production, use:
- Video CDN (Cloudflare Stream, Mux)
- Adaptive bitrate streaming
- Video compression

## Cost Estimation

### Free Tier Limits

**Supabase Free:**
- 500MB database
- 1GB file storage
- 2GB bandwidth

**Vercel Free:**
- 100GB bandwidth
- Unlimited deployments
- 100 hours serverless function execution

**Stripe:**
- No monthly fees
- 2.9% + $0.30 per transaction

### Scaling Costs

For 1000 active users:
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Stripe fees: Variable based on withdrawals

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

## Next Steps

1. ✅ Deploy application
2. ✅ Test all features
3. ✅ Add real video content
4. ✅ Configure payment processing
5. ✅ Set up monitoring
6. ✅ Launch to users!

---

**Need Help?** Contact: bilalsha03255@gmail.com