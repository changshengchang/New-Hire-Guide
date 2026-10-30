// Persistent photo storage utility using Canvas compression, LocalStorage & IndexedDB

const PHOTO_STORAGE_KEY = 'sanyi_facility_photos_v1';
const DB_NAME = 'sanyi_portal_db';
const DB_VERSION = 1;
const STORE_NAME = 'facility_photos';

/**
 * Open IndexedDB safely with fallback
 */
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch (e) {
      console.warn('IndexedDB unavailable', e);
      resolve(null);
    }
  });
}

/**
 * Compress an image file using an HTML5 canvas to safe dimensions and web quality
 * Reduces 5MB-15MB camera photos down to ~80KB-150KB without visual loss
 */
export function compressImage(
  file: File,
  maxWidth = 1280,
  maxHeight = 960,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Get all custom facility photos saved in localStorage synchronously
 */
export function getSavedPhotosFromLocalStorage(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read photos from localStorage', e);
  }
  return {};
}

/**
 * Save custom facility photo to both LocalStorage and IndexedDB
 */
export async function saveFacilityPhoto(facilityId: string, photoDataUrl: string): Promise<void> {
  // 1. Save to LocalStorage
  try {
    const existing = getSavedPhotosFromLocalStorage();
    existing[facilityId] = photoDataUrl;
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('LocalStorage save error (likely quota)', e);
  }

  // 2. Save to IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(photoDataUrl, facilityId);
    }
  } catch (e) {
    console.warn('IndexedDB save error', e);
  }
}

/**
 * Reset facility photo back to default
 */
export async function removeFacilityPhoto(facilityId: string): Promise<void> {
  try {
    const existing = getSavedPhotosFromLocalStorage();
    delete existing[facilityId];
    localStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn(e);
  }

  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(facilityId);
    }
  } catch (e) {
    console.warn(e);
  }
}

/**
 * Load all saved photos from IndexedDB (for async hydration on mount)
 */
export async function loadAllFacilityPhotosFromIndexedDB(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    if (!db) return {};
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      const photos: Record<string, string> = {};
      req.onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
          photos[cursor.key as string] = cursor.value;
          cursor.continue();
        } else {
          resolve(photos);
        }
      };
      req.onerror = () => resolve({});
    });
  } catch (e) {
    return {};
  }
}
