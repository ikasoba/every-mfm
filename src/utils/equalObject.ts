export const equalObject = <A extends object, B extends object>(
  a: A,
  b: B
): a is A & B => {
  for (const key in b) {
    if (!(isIndexable(a, key) && Object.is(a[key], b[key]))) {
      return false;
    }
  }

  return true;
};

export const isIndexable = <O extends object, K extends string | number>(
  o: O,
  k: K
): o is O & { [_ in K]: unknown } => {
  return k in o;
};
