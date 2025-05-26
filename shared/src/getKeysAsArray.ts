import lodashKeys from 'lodash/keys'

// https://catchts.com/union-array
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>
type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never
type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true
type UnionToArray<T, A extends unknown[] = []> = IsUnion<T> extends true
  ? UnionToArray<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
  : [T, ...A]

export const getKeysAsArray = <T>(obj: T): UnionToArray<keyof T> => {
  return lodashKeys(obj) as UnionToArray<keyof T>
}
