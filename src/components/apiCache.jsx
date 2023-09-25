let cache = {};

export function setCache(key, data) {
  cache[key] = data;
}

export function getCache(key) {
  return cache[key];
}

export function clearCache() {
  cache = {};
}
