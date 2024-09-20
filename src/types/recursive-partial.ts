export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends Date
    ? T[P] // Do not make Date partial
    : T[P] extends (infer U)[]
      ? RecursivePartial<U>[]
      : T[P] extends object | undefined
        ? RecursivePartial<T[P]>
        : T[P];
};
