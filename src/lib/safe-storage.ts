/**
 * Safe storage utility for localStorage and sessionStorage
 * Handles cases where storage is unavailable (Safari private mode, etc.)
 */

const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const isSessionStorageAvailable = (): boolean => {
  try {
    const testKey = "__test__";
    sessionStorage.setItem(testKey, testKey);
    sessionStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// In-memory fallback storage
const memoryStorage: { [key: string]: string } = {};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (!isLocalStorageAvailable()) {
        return memoryStorage[key] || null;
      }
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem error:", e);
      return memoryStorage[key] || null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (!isLocalStorageAvailable()) {
        memoryStorage[key] = value;
        return;
      }
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage.setItem error:", e);
      memoryStorage[key] = value;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (!isLocalStorageAvailable()) {
        delete memoryStorage[key];
        return;
      }
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.removeItem error:", e);
      delete memoryStorage[key];
    }
  },

  clear: (): void => {
    try {
      if (!isLocalStorageAvailable()) {
        Object.keys(memoryStorage).forEach((key) => delete memoryStorage[key]);
        return;
      }
      localStorage.clear();
    } catch (e) {
      console.warn("localStorage.clear error:", e);
      Object.keys(memoryStorage).forEach((key) => delete memoryStorage[key]);
    }
  },
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (!isSessionStorageAvailable()) {
        return memoryStorage[key] || null;
      }
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn("sessionStorage.getItem error:", e);
      return memoryStorage[key] || null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (!isSessionStorageAvailable()) {
        memoryStorage[key] = value;
        return;
      }
      sessionStorage.setItem(key, value);
    } catch (e) {
      console.warn("sessionStorage.setItem error:", e);
      memoryStorage[key] = value;
    }
  },

  removeItem: (key: string): void => {
    try {
      if (!isSessionStorageAvailable()) {
        delete memoryStorage[key];
        return;
      }
      sessionStorage.removeItem(key);
    } catch (e) {
      console.warn("sessionStorage.removeItem error:", e);
      delete memoryStorage[key];
    }
  },

  clear: (): void => {
    try {
      if (!isSessionStorageAvailable()) {
        Object.keys(memoryStorage).forEach((key) => delete memoryStorage[key]);
        return;
      }
      sessionStorage.clear();
    } catch (e) {
      console.warn("sessionStorage.clear error:", e);
      Object.keys(memoryStorage).forEach((key) => delete memoryStorage[key]);
    }
  },
};
