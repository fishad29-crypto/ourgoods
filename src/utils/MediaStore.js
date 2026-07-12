const DB_NAME = 'MediaManagerDB';
const DB_VERSION = 1;
const STORE_NAME = 'mediaFiles';

let dbPromise = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  }
  return dbPromise;
};

export const saveMedia = async (mediaItem) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    // clone to avoid storing object URLs which can cause issues or aren't needed in DB
    const itemToStore = {
      id: mediaItem.id,
      name: mediaItem.name,
      type: mediaItem.type,
      size: mediaItem.size,
      originalSize: mediaItem.originalSize,
      rawFile: mediaItem.rawFile,
      folderId: mediaItem.folderId || null
    };
    const request = store.put(itemToStore);

    request.onsuccess = () => resolve(itemToStore);
    request.onerror = (e) => reject(e.target.error);
  });
};

export const getAllMedia = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (e) => {
      // Recreate blob URLs for the loaded files so they can be rendered in the browser
      const items = e.target.result.map(item => {
        try {
          return {
            ...item,
            url: URL.createObjectURL(item.rawFile)
          };
        } catch (err) {
          console.error("Failed to create object URL for file", item, err);
          return null;
        }
      }).filter(Boolean);
      resolve(items);
    };
    request.onerror = (e) => reject(e.target.error);
  });
};

export const deleteMedia = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
};

export const deleteMultipleMedia = async (ids) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    ids.forEach(id => store.delete(id));

    transaction.oncomplete = () => resolve();
    transaction.onerror = (e) => reject(e.target.error);
  });
};

export const updateMediaFolder = async (ids, folderId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    ids.forEach(id => {
      const getReq = store.get(id);
      getReq.onsuccess = (e) => {
        const item = e.target.result;
        if (item) {
          item.folderId = folderId;
          store.put(item);
        }
      };
    });

    transaction.oncomplete = () => resolve();
    transaction.onerror = (e) => reject(e.target.error);
  });
};
