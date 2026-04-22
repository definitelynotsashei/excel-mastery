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

export function normalizeStoredUiState(uiState, challengeIds, viewIds) {
  if (!isPlainObject(uiState)) {
    return {};
  }

  const validChallengeIds = new Set(challengeIds);
  const validViewIds = new Set(viewIds);
  const normalizedUiState = {};

  if (typeof uiState.activeChallengeId === "string" && validChallengeIds.has(uiState.activeChallengeId)) {
    normalizedUiState.activeChallengeId = uiState.activeChallengeId;
  }

  if (typeof uiState.currentView === "string" && validViewIds.has(uiState.currentView)) {
    normalizedUiState.currentView = uiState.currentView;
  }

  return normalizedUiState;
}

export function createStoredAppStatePayload({ progressByChallengeId, uiState = {} }) {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    progressByChallengeId,
    uiState,
  };
}

export function parseStoredAppStatePayload(payload, challengeIds, viewIds = []) {
  if (isPlainObject(payload) && isPlainObject(payload.progressByChallengeId)) {
    return {
      progressByChallengeId: normalizeStoredProgressRecord(payload.progressByChallengeId, challengeIds),
      uiState: normalizeStoredUiState(payload.uiState, challengeIds, viewIds),
    };
  }

  return {
    progressByChallengeId: normalizeStoredProgressRecord(payload, challengeIds),
    uiState: {},
  };
}

export function createStoredProgressPayload(progressByChallengeId) {
  return createStoredAppStatePayload({ progressByChallengeId });
}

export function parseStoredProgressPayload(payload, challengeIds) {
  return parseStoredAppStatePayload(payload, challengeIds).progressByChallengeId;
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
    async loadAppState(challengeIds, viewIds) {
      const payload = await Promise.resolve(window.storage.get(STORAGE_KEY));
      return parseStoredAppStatePayload(payload, challengeIds, viewIds);
    },
    async saveAppState(appState) {
      const payload = createStoredAppStatePayload(appState);
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

async function loadFromIndexedDb(challengeIds, viewIds) {
  const database = await openProgressDatabase();

  if (!database) {
    return {};
  }

  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const payload = await requestToPromise(store.get(STORAGE_KEY));

    return parseStoredAppStatePayload(payload, challengeIds, viewIds);
  } finally {
    database.close();
  }
}

async function saveToIndexedDb(appState) {
  const database = await openProgressDatabase();

  if (!database) {
    return;
  }

  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await requestToPromise(store.put(createStoredAppStatePayload(appState), STORAGE_KEY));
  } finally {
    database.close();
  }
}

export async function loadAppState(challengeIds, viewIds = []) {
  try {
    const windowStorageAdapter = getWindowStorageAdapter();

    if (windowStorageAdapter) {
      return await windowStorageAdapter.loadAppState(challengeIds, viewIds);
    }

    return await loadFromIndexedDb(challengeIds, viewIds);
  } catch (error) {
    console.warn("Excel Mastery could not load saved app state.", error);
    return { progressByChallengeId: {}, uiState: {} };
  }
}

export async function saveAppState(appState) {
  try {
    const windowStorageAdapter = getWindowStorageAdapter();

    if (windowStorageAdapter) {
      await windowStorageAdapter.saveAppState(appState);
      return;
    }

    await saveToIndexedDb(appState);
  } catch (error) {
    console.warn("Excel Mastery could not save app state.", error);
  }
}

export async function loadProgressState(challengeIds) {
  const result = await loadAppState(challengeIds);
  return result.progressByChallengeId;
}

export async function saveProgressState(progressByChallengeId) {
  await saveAppState({ progressByChallengeId });
}
