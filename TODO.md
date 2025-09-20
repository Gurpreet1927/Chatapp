# TODO: Fix View Button for PDFs in Chat.jsx

- [x] Add a helper function to convert data URL to blob URL
- [x] Update the View button's onClick to use the blob URL instead of direct data URL
- [x] Test the fix by sending a PDF and clicking View (fixed error handling)
- [x] Fix server-side PDF upload to store data URLs directly without Cloudinary

# TODO: Fix 404 errors for CSS and JS assets

- [x] Add import for 'path' module in server/server.js
- [x] Add express.static middleware to serve 'docs' directory at '/chat' path in server/server.js
- [x] Update base path in client/vite.config.js to '/chat/' for GitHub Pages
- [x] Set build outDir to '../docs' in client/vite.config.js
- [x] Create root package.json with build script
- [x] Run npm run build from client to rebuild client
- [x] Fix base path mismatch in docs/index.html from '/Chatapp/' to '/chat/'
- [ ] Commit and push the updated docs/ folder to GitHub to redeploy
- [ ] Verify that CSS and JS files load without 404 errors on GitHub Pages
