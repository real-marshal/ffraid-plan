import brotliPromise from 'brotli-wasm' // Import the default export

export function lerp(a: number, b: number, k: number): number {
  return a + k * (b - a)
}

export function isObjEmpty(obj: object | undefined | null): boolean {
  return !obj || Object.keys(obj).length === 0
}

export function lerpRGB(
  [r1, g1, b1]: [r1: number, g1: number, b1: number],
  [r2, g2, b2]: [r2: number, g2: number, b2: number],
  k: number
): [r: number, g: number, b: number] {
  return [lerp(r1, r2, k), lerp(g1, g2, k), lerp(b1, b2, k)]
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(n, max))
}

export function round(n: number, digits = 2): number {
  return Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits)
}

export async function compressBrotli(data: Uint8Array | string, quality: number = 11) {
  const brotli = await brotliPromise

  const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data

  return brotli.compress(buffer, { quality: quality })
}

export async function uncompressBrotli(data: Uint8Array) {
  const brotli = await brotliPromise

  return brotli.decompress(data)
}
