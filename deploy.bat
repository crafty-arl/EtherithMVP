@echo off
echo 🚀 Starting auto-deployment process...

echo 📦 Building project...
call npm run build-only
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo 🌐 Deploying to Cloudflare Pages...
call wrangler pages deploy dist --project-name=etherith-production
if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo ✅ Deployment successful!
echo 🌍 Your app is live at: https://etherith-production.pages.dev
echo 📱 You can now test your YJS collaborative demos!
pause
