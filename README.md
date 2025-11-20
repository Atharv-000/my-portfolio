Premium Portfolio — Final Package
=====================================

This is the full, ready-to-run portfolio project you requested. It includes all files so you don't have to create anything.

Contents
--------
- index.html
- styles.css
- app.js
- /api/sendMail.js         (serverless email handler - requires env vars)
- resume.pdf               (placeholder - replace with your real resume)
- package.json
- README.md
- /assets/icons (sample icons)
- /assets/thumbs (sample thumbnails)

Quick start (local)
-------------------
1. Unzip the package and open a terminal inside the folder.
2. Install 'serve' if you want the npm scripts to work:
   npm install -g serve
3. Run the site:
   npm run dev
4. Open http://localhost:3000

Notes:
- The app uses History API routing (clean URLs like /data-science). When serving statically (serve -s .) the SPA fallback is enabled so routes work locally.
- Contact form posts to /api/sendMail. To make emails work you must deploy the /api/sendMail.js as a serverless function (Vercel recommended) and set environment variables.

Serverless email setup (Vercel)
-------------------------------
1. Sign up / log in to Vercel and create a new project (Import from local).
2. Ensure /api/sendMail.js is in the /api folder at the project root.
3. Set these environment variables in Vercel:
   - GMAIL_CLIENT_ID
   - GMAIL_CLIENT_SECRET
   - GMAIL_REFRESH_TOKEN
   - GMAIL_USER_EMAIL
   - RECAPTCHA_SECRET_KEY   (if using reCAPTCHA)
4. Deploy.

How to obtain Gmail OAuth2 credentials (summary)
------------------------------------------------
1. Go to Google Cloud Console -> create a project -> enable Gmail API.
2. Configure OAuth consent screen.
3. Create OAuth credentials (Web application). Set redirect URI to:
   https://developers.google.com/oauthplayground
4. Use OAuth Playground to get a refresh token (select Gmail scopes).

reCAPTCHA (optional but recommended)
-----------------------------------
1. Register your domain at https://www.google.com/recaptcha/admin
2. Choose v3 (invisible) or v2 (checkbox) and obtain site & secret keys.
3. Add the site key in the client (if you want) and set secret in server env var RECAPTCHA_SECRET_KEY.

Customization
-------------
- Replace resume.pdf with your real resume (keep filename resume.pdf).
- Edit content and projects inside app.js (clear comments mark where to edit).
- Replace icons in /assets as needed.

If you want, I can also:
- Convert this to a React + Tailwind project (npm install, dev server, build).
- Deploy to Vercel for you (I will give exact env var values to paste).
- Add reCAPTCHA client-side integration into the form.
