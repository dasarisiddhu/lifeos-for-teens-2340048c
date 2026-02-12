export function getStore<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(`lifeos_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export function setStore<T>(key: string, value: T): void {
  localStorage.setItem(`lifeos_${key}`, JSON.stringify(value));
}

export function updateStore<T>(key: string, updater: (prev: T) => T, fallback: T): T {
  const current = getStore(key, fallback);
  const next = updater(current);
  setStore(key, next);
  return next;
}
