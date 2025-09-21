@echo off
echo Building React + Tailwind CSS version of Etherith...
npm run build

echo.
echo Deploying to Cloudflare Pages...
wrangler pages deploy dist --project-name=etherith-production --commit-dirty=true

echo.
echo React deployment complete!
echo Check the deployment URL in the output above.