export function getEnumValues<T extends {}, V>(enumObj: T): V[] {
  return Object.values(enumObj);
}
