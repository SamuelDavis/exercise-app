import { writable } from "svelte/store";
import type { JSONSet, Set } from "./types";

const LOCAL_STORAGE_KEY_SETS = "sets";

export const sets = writable<Set[]>(readSetsFromLocalStorage());
sets.subscribe(writeSetsToLocalStorage);

function readSetsFromLocalStorage(): Set[] {
  const raw: JSONSet[] = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_SETS) || "[]"
  );
  return raw.map(({ timestamps, ...rest }) => ({
    ...rest,
    timestamps: timestamps.map((timestamp) => new Date(timestamp)),
  }));
}

function writeSetsToLocalStorage(sets: Set[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY_SETS, JSON.stringify(sets));
}
