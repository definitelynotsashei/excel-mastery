const STORAGE_KEY = "excel-mastery-progress";
const STORAGE_SCHEMA_VERSION = 1;
const DB_NAME = "excel-mastery";
const DB_VERSION = 1;
const STORE_NAME = "app-state";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clampStars(starsEarned) {
  if (!Number.isFinite(starsEarned)) {
    return 1;
  }

  return Math.min(Math.max(Math.round(starsEarned), 1), 3);
}

export function normalizeStoredProgressRecord(progressByChallengeId, challengeIds) {
  if (!isPlainObject(progressByChallengeId)) {
    return {};
  }

  const validChallengeIds = new Set(challengeIds);

  return Object.entries(progressByChallengeId).reduce((normalizedProgress, [challengeId, progress]) => {
    if (!validChallengeIds.has(challengeId) || !isPlainObject(progress) || !progress.completed) {
      return normalizedProgress;
    }

    return {
      ...normalizedProgress,
      [challengeId]: {
        completed: true,
        starsEarned: clampStars(progress.starsEarned),
      },
    };
  }, {});
}

export function createStoredProgressPayload(progressByChallengeId) {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    progressByChallengeId,
  };
}

export function parseStoredProgressPayload(payload, challengeIds) {
  if (isPlainObject(payload) && isPlainObject(payload.progressByChallengeId)) {
    return normalizeStoredProgressRecord(payload.progressByChallengeId, challengeIds);
  }

  return normalizeStoredProgressRecord(payload, challengeIds);
}

function getWindowStorageAdapter() {
  if (typeof window === "undefined" || !window.storage) {
    return null;
  }

  const supportsGet = typeof window.storage.get === "function";
  const supportsSet = typeof window.storage.set === "function";

  if (!supportsGet || !supportsSet) {
    return null;
  }

  return {
    async load(challengeIds) {
      const payload = await Promise.resolve(window.storage.get(STORAGE_KEY));
      return parseStoredProgressPayload(payload, challengeIds);
    },
    async save(progressByChallengeId) {
      const payload = createStoredProgressPayload(progressByChallengeId);
      await Promise.resolve(window.storage.set(STORAGE_KEY, payload));
    },
  };
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Storage request failed."));
  });
}

async function openProgressDatabase() {
  if (typeof window === "undefined" || !window.indexedDB) {
    return null;
  }

  const openRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

  openRequest.onupgradeneeded = () => {
    const database = openRequest.result;

    if (!database.objectStoreNames.contains(STORE_NAME)) {
      database.createObjectStore(STORE_NAME);
    }
  };

  return requestToPromise(openRequest);
}

async function loadFromIndexedDb(challengeIds) {
  const database = await openProgressDatabase();

  if (!database) {
    return {};
  }

  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const payload = await requestToPromise(store.get(STORAGE_KEY));

    return parseStoredProgressPayload(payload, challengeIds);
  } finally {
    database.close();
  }
}

async function saveToIndexedDb(progressByChallengeId) {
  const database = await openProgressDatabase();

  if (!database) {
    return;
  }

  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await requestToPromise(store.put(createStoredProgressPayload(progressByChallengeId), STORAGE_KEY));
  } finally {
    database.close();
  }
}

export async function loadProgressState(challengeIds) {
  try {
    const windowStorageAdapter = getWindowStorageAdapter();

    if (windowStorageAdapter) {
      return await windowStorageAdapter.load(challengeIds);
    }

    return await loadFromIndexedDb(challengeIds);
  } catch (error) {
    console.warn("Excel Mastery could not load saved progress.", error);
    return {};
  }
}

export async function saveProgressState(progressByChallengeId) {
  try {
    const windowStorageAdapter = getWindowStorageAdapter();

    if (windowStorageAdapter) {
      await windowStorageAdapter.save(progressByChallengeId);
      return;
    }

    await saveToIndexedDb(progressByChallengeId);
  } catch (error) {
    console.warn("Excel Mastery could not save progress.", error);
  }
}
