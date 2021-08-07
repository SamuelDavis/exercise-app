// GENERAL
export type Dict<T> = { [key: string]: T };
export type Record = { id: string };
export type Set = Record & {
  exercise: string;
  modality: string;
  repetitions: number;
  workload: number;
  exertion: number;
  timestamps: string[];
};
export type JSONSet = Set & { timestamps: number[] };

// SPECIFIC
export type TimeElapsed = { timestamp: string; aria: string; elapsed: string };
