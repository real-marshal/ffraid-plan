export function lerp(a: number, b: number, k: number): number {
  return a + k * (b - a)
}

export function isObjEmpty(obj: object | undefined | null): boolean {
  return !obj || Object.keys(obj).length === 0
}
