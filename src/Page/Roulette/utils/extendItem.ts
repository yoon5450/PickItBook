

export function extendItem<T>(arr: T[], min = 17): T[] {
  const copyArr = arr.slice();
  const n = copyArr.length;

  if (n === 0) return [];
  if (n >= min) return copyArr;

  const repeat = Math.ceil(min / n);
  const newArr = Array.from({ length: n * repeat }, (_, i) => copyArr[i % n]);
  return newArr;
}