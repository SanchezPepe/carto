/**
 * Upload data files to Firebase Storage
 *
 * Run with: node scripts/upload-to-storage.js
 *
 * Prerequisites:
 * 1. Install firebase-tools: npm install -g firebase-tools
 * 2. Login to Firebase: firebase login
 * 3. Ensure you're in the project directory
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Files to upload
const FILES_TO_UPLOAD = [
  {
    local: 'storage-data/mexico-datasets.json',
    remote: 'data/mexico-datasets.json',
    contentType: 'application/json'
  },
  {
    local: 'storage-data/mexico-cities.json',
    remote: 'data/mexico-cities.json',
    contentType: 'application/json'
  },
  {
    local: 'storage-data/mexico-states.geo.json',
    remote: 'data/mexico-states.geo.json',
    contentType: 'application/geo+json'
  }
];

async function main() {
  console.log('Firebase Storage Upload Script');
  console.log('==============================\n');

  // Check for service account key
  const serviceAccountPath = join(projectRoot, 'service-account.json');
  if (!existsSync(serviceAccountPath)) {
    console.log('Service account key not found.');
    console.log('\nTo upload files, you need to:');
    console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
    console.log('2. Click "Generate New Private Key"');
    console.log('3. Save the file as "service-account.json" in the project root');
    console.log('\nAlternatively, you can upload files manually via Firebase Console:');
    console.log('1. Go to https://console.firebase.google.com/project/carto-ppsa/storage');
    console.log('2. Create a folder named "data"');
    console.log('3. Upload the files from the storage-data/ directory');
    console.log('\nFiles to upload:');
    FILES_TO_UPLOAD.forEach(f => {
      console.log(`  - ${f.local} -> ${f.remote}`);
    });
    process.exit(1);
  }

  // Initialize Firebase Admin
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'carto-ppsa.firebasestorage.app'
  });

  const bucket = getStorage().bucket();

  console.log('Uploading files to Firebase Storage...\n');

  for (const file of FILES_TO_UPLOAD) {
    const localPath = join(projectRoot, file.local);

    if (!existsSync(localPath)) {
      console.log(`[SKIP] ${file.local} - File not found`);
      continue;
    }

    try {
      const content = readFileSync(localPath);
      const remoteFile = bucket.file(file.remote);

      await remoteFile.save(content, {
        metadata: {
          contentType: file.contentType,
          cacheControl: 'public, max-age=3600'
        }
      });

      // Make file publicly readable
      await remoteFile.makePublic();

      console.log(`[OK] ${file.local} -> ${file.remote}`);
    } catch (error) {
      console.log(`[ERROR] ${file.local}: ${error.message}`);
    }
  }

  console.log('\nUpload complete!');
  console.log('\nDon\'t forget to configure Storage Rules in Firebase Console:');
  console.log('https://console.firebase.google.com/project/carto-ppsa/storage/rules');
}

main().catch(console.error);
