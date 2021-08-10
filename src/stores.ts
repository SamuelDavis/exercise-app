import { derived, Readable, writable } from "svelte/store";
import type { Dict, JSONSet, Set } from "./types";
import { toDateTimeLocalString } from "./util";

const LOCAL_STORAGE_KEY_SETS = "sets";

export const sets = writable<Set[]>(readSetsFromLocalStorage());
sets.subscribe(writeSetsToLocalStorage);
export const exercises = derived([sets], ([sets]) => {
  return sets.reduce((acc, set) => {
    return acc.includes(set.exercise) ? acc : acc.concat(set.exercise);
  }, []);
});
export const modalities = derived([sets], ([sets]) => {
  const allModalities = new Set();
  const modalitiesByExercise: Dict<globalThis.Set<string>> = {};

  for (const { exercise, modality } of sets) {
    if (!(exercise && modality)) continue;
    const key = exercise.toLowerCase();
    allModalities.add(modality);
    if (!(key in modalitiesByExercise)) modalitiesByExercise[key] = new Set();
    modalitiesByExercise[key].add(modality);
  }

  return new Proxy<Dict<string[]>>(
    {},
    {
      get(_, key: string) {
        key = key.toLowerCase().replaceAll(/\s/g, " ").trim();
        return Array.from(modalitiesByExercise[key] ?? allModalities);
      },
    }
  );
});
export const suggest = derived([sets], ([sets]) => {
  return function (key: keyof Set, value?: string | number) {
    const history = new Set<Set[keyof Set]>();
    history.add(value);
    for (const set of sets) history.add(set[key]);

    return Array.from(history);
  };
});

function readSetsFromLocalStorage(): Set[] {
  const raw: JSONSet[] = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEY_SETS) || "[]"
  );
  return raw.map(({ timestamps, ...rest }) => ({
    ...rest,
    timestamps: timestamps.map((ts) => toDateTimeLocalString(new Date(ts))),
  }));
}

function writeSetsToLocalStorage(sets: Set[]): void {
  localStorage.setItem(
    LOCAL_STORAGE_KEY_SETS,
    JSON.stringify(
      sets.map((set) => ({
        ...set,
        timestamps: set.timestamps.map((timestamp) =>
          new Date(timestamp).getTime()
        ),
      }))
    )
  );
}
