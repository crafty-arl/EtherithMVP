# Discord Integration Setup for Etherith

This guide will help you set up Discord OAuth authentication for your Etherith project deployed on Cloudflare Pages.

## Prerequisites

- A Discord account
- A Cloudflare account with Pages configured
- Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Etherith")
3. Go to the "OAuth2" section in the left sidebar
4. Note down your **Client ID** and **Client Secret**

### Configure OAuth2 Settings

In the OAuth2 section:

1. **Scopes**: Select `identify` and `email`
2. **Redirect URIs**: Add these URLs:
   - `https://your-pages-domain.pages.dev/dashboard.html` (replace with your actual domain)
   - `http://localhost:3000/dashboard.html` (for local development)
   - `http://localhost:5173/dashboard.html` (for Vite dev server)

## Step 2: Set up Cloudflare Secrets

### For Production Environment

```bash
# Set Discord Client ID (this can be public)
wrangler pages secret put DISCORD_CLIENT_ID --project-name etherith-mvp

# Set Discord Client Secret (keep this private!)
wrangler pages secret put DISCORD_CLIENT_SECRET --project-name etherith-mvp
```

### For Preview Environment (optional)

```bash
# Set Discord Client ID for preview deployments
wrangler pages secret put DISCORD_CLIENT_ID --project-name etherith-mvp --env preview

# Set Discord Client Secret for preview deployments  
wrangler pages secret put DISCORD_CLIENT_SECRET --project-name etherith-mvp --env preview
```

## Step 3: Update Configuration Files

### Update src/js/config.js

Replace the placeholder Discord Client IDs in `src/js/config.js`:

```javascript
clientId: isDevelopment 
    ? 'YOUR_DEV_DISCORD_CLIENT_ID'     // Replace with your dev app client ID
    : 'YOUR_PROD_DISCORD_CLIENT_ID',   // Replace with your production app client ID
```

### Update wrangler.toml (if needed)

Make sure your `wrangler.toml` has the correct project name and redirect URI:

```toml
name = "etherith-mvp"  # Should match your Pages project name

[env.production.vars]
DISCORD_REDIRECT_URI = "https://your-actual-domain.pages.dev/dashboard.html"

[env.preview.vars]
DISCORD_REDIRECT_URI = "https://your-actual-domain.pages.dev/dashboard.html"
```

## Step 4: Deploy

### Deploy to Cloudflare Pages

```bash
# Build and deploy
npm run build
wrangler pages deploy dist --project-name etherith-mvp
```

Or use the integrated deploy command:

```bash
npm run deploy
```

## Step 5: Verify Setup

1. Visit your deployed site
2. Click "Login with Discord"
3. Complete the OAuth flow
4. You should be redirected back to your dashboard with user info displayed

## Local Development Setup

For local development:

1. Create a separate Discord application for development
2. Update the `clientId` in `src/js/config.js` for the development environment
3. Add `http://localhost:5173/dashboard.html` to your Discord app's redirect URIs
4. Run your development server:

```bash
npm run dev
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect_uri"**: Make sure the redirect URI in your Discord app exactly matches what's being sent
2. **"Invalid client_id"**: Verify the client ID is correctly set in your environment variables
3. **CORS errors**: Ensure your worker function is deployed and accessible
4. **"Token exchange failed"**: Check that your client secret is properly set as a Cloudflare secret

### Debug Mode

You can enable debug logging by opening browser dev tools. In development mode, configuration details will be logged to the console.

### Checking Secrets

To verify your secrets are set:

```bash
# List all secrets for your project
wrangler pages secret list --project-name etherith-mvp
```

## Security Notes

- **Never commit your Discord Client Secret** to version control
- Client ID can be public, but Client Secret must remain private
- Use different Discord applications for development and production
- Regularly rotate your Client Secret if needed

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all redirect URIs are correctly configured
3. Ensure secrets are properly set in Cloudflare
4. Test with a fresh incognito/private browser session

---

## Quick Reference

### Environment Variables Needed

- `DISCORD_CLIENT_ID`: Your Discord application's client ID
- `DISCORD_CLIENT_SECRET`: Your Discord application's client secret (keep private!)

### Important URLs

- Discord Developer Portal: https://discord.com/developers/applications
- Cloudflare Dashboard: https://dash.cloudflare.com
- Your deployed site: https://your-project.pages.dev

### Commands

```bash
# Deploy to production
npm run deploy

# Set secrets
wrangler pages secret put DISCORD_CLIENT_ID --project-name etherith-mvp
wrangler pages secret put DISCORD_CLIENT_SECRET --project-name etherith-mvp

# List secrets
wrangler pages secret list --project-name etherith-mvp
```
