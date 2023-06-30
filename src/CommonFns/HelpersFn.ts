import { WithId } from "../Types/CalcModuleTypes";
import { useUtils } from "../hooks/useUtils";



export const _uniueArray = <T>(arr: T[]) => Array.from(new Set(arr))
export const _ID = useUtils.stringID

export function addPropFn<T, K extends string>(item: T, propName: K, fn: Function) {
    const new_item = { ...item, [propName]: fn }
    return new_item
}

export function _mapID<T extends WithId>(items: T[]) {
    return items.map(i => i.id)
}
export function _stringify(...args: number[] | number[][]) {
    // _log(args.join('-'))
    if (Array.isArray(args)) return args.join('-')
    else throw new Error("NO ARRRRAY");

}

export const _getSet = (getKey: string, setKey: string, transform: Function) => (obj: any) => ({ ...obj, [setKey]: transform(obj[getKey]), });

