import { InnerCoords } from "../Models/BalkaModel/InterfaceBalkaModels";
import { EndPoint, Point, StartPoint } from "../Models/PointsModel/Point";
import { WithId } from "../Types/CalcModuleTypes";
import { _log, useUtils } from "../hooks/useUtils";



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

export function _mergeObjProps<T, K>(a: T, b: K): T & K {
    return { ...a, ...b };
}

export function _getMiddleCoords(coords: InnerCoords | [Point, Point] | [number, number, number, number]) {

    const mid = (pts: InnerCoords): Point => {
        const { x1, x2, y1, y2 } = pts
        return _Pt(Math.abs(x2 - x1) / 2 + x1, Math.abs(y2 - y1) / 2 + y1)
    }
    if (Array.isArray(coords) && coords.length === 4) return mid(_PtInner(...coords))
    if (Array.isArray(coords) && coords.length === 2) {
        const [s, e] = coords
        return mid({ ...s.asStart, ...e.asEnd })
    }

    return mid(coords)
}

export function _Pt(...n: [number, number, number, number]): [StartPoint, EndPoint]
export function _Pt(...n: [number, number]): Point
export function _Pt(...numbers: number[]) {
    if (numbers.length % 2 === 1) {
        _log("неверное число членов")
        return []
    }

    if (numbers.length === 2) {
        const [x, y] = numbers
        return new Point(x, y)
    }

    if (numbers.length === 4) {
        const [x1, y1, x2, y2] = numbers
        return [new StartPoint(x1, y1), new EndPoint(x2, y2)] as const
    }
}
export function _PtInner(...numbs: [number, number, number, number]): InnerCoords {
    const [s, e] = _Pt(...numbs)
    return { ...s, ...e }
}