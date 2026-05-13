# 3rd Anniversary Website - Final Steps & Deployment

Congratulations! Your anniversary website is ready. It is now configured to load photos directly from your Google Photos album, so you don't need to download 1.5GB of data.

## 1. Refresh Your Memories
- **Automated Fetching**: The website uses a script to get the latest direct links from your Google Photos album.
- **Run the Script**: Before you deploy, or if you notice photos are no longer loading, run:
  ```bash
  npm run refresh-media
  ```
- This will update `src/data/mediaConfig.json` with the most recent links.

## 2. Write Your Promise
- Open `public/data/letter.txt`.
- Delete the placeholder text and paste your heartfelt letter there.
- Save the file.

## 3. Test Locally
- Run `npm run dev` in your terminal.
- Open the provided local URL (usually `http://localhost:5173`) in your browser.
- Test the flow: Landing -> Media -> Gift Boxes -> Promise.

## 4. Deployment (Launch!)
The easiest way to share this is using **Vercel** or **Netlify**.

### Option A: Vercel (Recommended)
1. Install the Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts to deploy.

### Option B: Manual Upload
1. Run `npm run refresh-media` one last time.
2. Run `npm run build`. This creates a `dist/` folder.
3. Go to [Netlify Drop](https://app.netlify.com/drop).
4. Drag and drop the `dist/` folder into the upload area.

## Technical Note
- The website is fully mobile-responsive.
- **Google Photos Note**: The direct links Google provides are temporary (they usually last for a few days/weeks). If the photos stop showing up on the live site, simply run `npm run refresh-media` and re-deploy your site.

