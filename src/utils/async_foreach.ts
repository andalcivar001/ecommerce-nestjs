export default async function asyncForEach<T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<void> | void,
): Promise<void> {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
