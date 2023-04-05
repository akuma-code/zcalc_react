export function useExtractObjectFields<T extends object>(obj: T): { key: string, value: string }[] {
    const res = Object.entries(obj).map(([k, v]) => ({ key: k, value: v }))
    return res
}