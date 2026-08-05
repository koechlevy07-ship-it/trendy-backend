const store = new Map();
const inFlight = new Map();
const MAX_ENTRIES = 1000;

function get(key) {
    const entry = store.get(key);
    if (!entry) return undefined;
    if (entry.expires <= Date.now()) {
        store.delete(key);
        return undefined;
    }
    return entry.value;
}

function set(key, value, ttlMs) {
    if (store.size >= MAX_ENTRIES) {
        const oldest = store.keys().next().value;
        if (oldest !== undefined) store.delete(oldest);
    }
    store.set(key, { value, expires: Date.now() + ttlMs });
}

async function remember(key, ttlMs, fn) {
    const cached = get(key);
    if (cached !== undefined) return cached;
    if (inFlight.has(key)) return inFlight.get(key);
    const promise = fn()
        .then((value) => {
            set(key, value, ttlMs);
            return value;
        })
        .finally(() => {
            inFlight.delete(key);
        });
    inFlight.set(key, promise);
    return promise;
}

function invalidate(prefix) {
    const full = prefix + ':';
    for (const key of store.keys()) {
        if (key.startsWith(full)) store.delete(key);
    }
}

function clear() {
    store.clear();
}

module.exports = { remember, invalidate, clear };
