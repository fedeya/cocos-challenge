export function groupBy<T>(
  array: T[],
  key: (item: T) => string | number,
): Record<string, T[]> {
  return array.reduce(
    (result, currentItem) => {
      const groupKey = key(currentItem).toString();

      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      result[groupKey].push(currentItem);
      return result;
    },
    {} as Record<string, T[]>,
  );
}
