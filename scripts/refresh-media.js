import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const ALBUM_URL = 'https://photos.app.goo.gl/SpMmsN7fkB57rr3t7';
const OUTPUT_FILE = './src/data/mediaConfig.json';

async function refreshMedia() {
  console.log('Fetching Google Photos album and identifying photos...');
  try {
    const response = await fetch(ALBUM_URL);
    const html = await response.text();
    
    const startMarker = "AF_initDataCallback({key: 'ds:1'";
    const startIndex = html.indexOf(startMarker);
    
    if (startIndex === -1) {
      console.error('Could not find ds:1 data marker.');
      return;
    }

    // The object starts at the first '{' after the marker
    const objectStart = html.indexOf('{', startIndex);
    
    // Find the end of the object by matching curly braces
    let braceCount = 0;
    let objectEnd = -1;
    for (let i = objectStart; i < html.length; i++) {
      if (html[i] === '{') braceCount++;
      if (html[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          objectEnd = i;
          break;
        }
      }
    }

    if (objectEnd === -1) {
      console.error('Could not find the end of the data object.');
      return;
    }

    const objectContent = html.substring(objectStart, objectEnd + 1);
    
    let albumData;
    try {
      // Use eval-like approach to parse the JS object literal
      const extractFn = new Function(`return ${objectContent}`);
      const fullObject = extractFn();
      albumData = fullObject.data;
    } catch (e) {
      console.error('Failed to extract data:', e.message);
      return;
    }

    if (!albumData || !Array.isArray(albumData[1])) {
      console.error('Album items not found in expected format.');
      return;
    }

    const items = albumData[1];
    const photoLinks = [];
    let videoCount = 0;

    for (const item of items) {
      const itemString = JSON.stringify(item);
      const isVideo = itemString.includes('76647426');

      if (isVideo) {
        videoCount++;
        continue;
      }

      const baseUrl = item[1]?.[0];
      if (baseUrl && baseUrl.startsWith('https://lh3.googleusercontent.com')) {
        photoLinks.push(`${baseUrl}=w1920-h1080`);
      }
    }

    console.log(`Found ${photoLinks.length} photos and identified ${videoCount} videos.`);

    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(photoLinks, null, 2));
    console.log(`Updated ${OUTPUT_FILE} with photos only.`);

  } catch (error) {
    console.error('Error refreshing media:', error);
  }
}

refreshMedia();
