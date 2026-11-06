/**
 * Where a browser blocks site data, merely touching `localStorage` throws, and the frozen AuthContext reads it unguarded,
 * which takes the whole app down. This puts an in-memory stand-in on `window` first, so every route still works for the
 * session. `storagePersists` lets a caller stay truthful about whether anything is really saved.
 */
function probe(): boolean {
  try {
    const key = "c4s.probe";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function memoryStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => Array.from(items.keys())[index] ?? null,
    removeItem: (key) => void items.delete(key),
    setItem: (key, value) => void items.set(key, String(value)),
  };
}

export const storagePersists = probe();

if (!storagePersists) {
  try {
    Object.defineProperty(window, "localStorage", { configurable: true, value: memoryStorage() });
  } catch {
    // The property could not be replaced: the app is no worse off than without this guard.
  }
}
