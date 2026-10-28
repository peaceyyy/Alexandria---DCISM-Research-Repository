"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_CHANGE_EVENT = "alexandria:local-storage-change";

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(STORAGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(STORAGE_CHANGE_EVENT, onStoreChange);
  };
}

function getServerSnapshot() {
  return null;
}

export function useLocalStorageValue(key: string) {
  const getSnapshot = useCallback(() => window.localStorage.getItem(key), [key]);
  const value = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    getServerSnapshot,
  );

  const setValue = useCallback(
    (nextValue: string) => {
      window.localStorage.setItem(key, nextValue);
      window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
    },
    [key],
  );

  return [value, setValue] as const;
}
