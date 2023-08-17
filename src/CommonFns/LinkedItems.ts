import { IPoint, InnerCoords, InnerCoordsKeys } from "../Models/BalkaModel/InterfaceBalkaModels"
import { WithId } from "../Types/CalcModuleTypes"
import { WithIdProp } from "../Types/DataModelTypes"
import { _log } from "../hooks/useUtils"
import { _mapID } from "./HelpersFn"
interface IObjectItem<T = any> {
    [key: string]: T
}
export interface WithPositionProp { pos: InnerCoords }
export interface IChainListActions<T> {
    push: (data: T) => ChainNode<T>
    prepend: (data: T) => ChainNode<T>
    deleteNode: (node: ChainNode<T>) => void
    traverse(): T[]
    size(): number
    search(comparator: (data: T) => boolean): ChainNode<T> | null
}
export interface IDataComparator<T> {
    (data: Partial<T>): boolean
}

type ComparatorResult<T> = {
    prev: ChainNode<T> | null
    next: ChainNode<T> | null
}
type IStart = { x1: number, y1: number }
type IEnd = { x2: number, y2: number }
type ICoordPosComparator = {
    onEnd: boolean
    onStart: boolean
}
export type ValueGetter<T = any> = (item: T) => string | number

// export type PartialProps<T> = { [Key in keyof T]?: Partial<T[Key]> }
type SetPartialProps<T> = { [K in keyof T]?: Partial<T[K]> }

const getLast = <T>(node: ChainNode<T>): ChainNode<T> => {
    return node.next ? getLast(node.next) : node
}
const checkNext = <T>(node: ChainNode<T>, comparator: IDataComparator<T>): ChainNode<T> | null => {
    if (comparator(node.data)) return node
    return node.next ? checkNext(node.next, comparator) : null
}

const getPoints = <T extends WithPositionProp>(item: T) => {
    const { x1, x2, y1, y2 } = item.pos
    const start = new Point(x1, y1)
    const end = new Point(x2, y2)
    return [start, end] as const
}



class Point implements IPoint {
    public x: number
    public y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public isEqualTo(point: Point) {
        return (point.x - this.x === 0 && point.y - this.y === 0)
    }
}

class ChainNode<T> {
    public next: ChainNode<T> | null = null
    public prev: ChainNode<T> | null = null
    constructor(public data: T) { }


    // public update_data(new_data_value: Partial<typeof this.data>): T {
    //     const keys = Object.keys(new_data_value) as unknown as (keyof T)[]
    //     _log("Keys: ", keys)

    //     keys.forEach(key => {
    //         const new_value = new_data_value[key]
    //         this.data[key] = typeof new_value === 'string' ? new_value : { ...this.data[key], ...new_value }
    //     }

    //     )
    //     return this.data
    // }
    public edit_data<K extends keyof T>(key: K, propValue: Partial<T[K]>): T {
        if (typeof propValue === 'string' || typeof propValue === 'number') return this.data = { ...this.data, [key]: propValue }
        return this.data = { ...this.data, [key]: { ...this.data[key], ...propValue } }
    }
}

class ChainList<T> implements IChainListActions<T>{
    public head: ChainNode<T> | null = null

    public push(data: T): ChainNode<T> {
        const node = new ChainNode(data);
        if (!this.head) {
            this.head = node;
        } else {
            const getLast = (node: ChainNode<T>): ChainNode<T> => {
                return node.next ? getLast(node.next) : node;
            };

            const lastNode = getLast(this.head);
            lastNode.next = node;
            node.prev = lastNode;
        }
        return node;
    }

    public prepend(data: T): ChainNode<T> {
        const node = new ChainNode(data)
        if (!this.head) {
            this.head = node

        } else {
            this.head.prev = node
            node.next = this.head
            this.head = node
        }

        return node
    }

    public deleteNode(node: ChainNode<T>): void {
        if (!node.prev) {
            this.head = node.next
        } else {
            const prevNode = node.prev
            prevNode.next = node.next
        }
    }

    public search(comparator: (data: T) => boolean): ChainNode<T> | null {
        const checkNext = (node: ChainNode<T>): ChainNode<T> | null => {
            if (comparator(node.data)) return node
            return node.next ? checkNext(node.next) : null
        }

        return this.head ? checkNext(this.head) : null
    }

    public traverse(): T[] {
        const arr: T[] = []
        if (!this.head) return arr

        const addToArray = (node: ChainNode<T>): T[] => {
            arr.push(node.data)
            return node.next ? addToArray(node.next) : arr
        }

        return addToArray(this.head)
    }

    public size(): number {
        _log(`Size: ${this.traverse().length} \nNodes:`, ...this.traverse())
        return this.traverse().length
    }

}

//! **********************************************************************************************************
//! в связаном списке ноды имеют свойства, значения которых должны быть равны значениям соседних нодов. например начало и конец отрезка
//!*   prev:{x2,y2} <-> current:{x1,y1,x2,y2} <-> next:{x1,y1}
//! **********************************************************************************************************
export class CoordsChainList<T extends WithPositionProp & WithId> extends ChainList<T>{

    public getCoordsNode(x: number, y: number) {

        const onEnd = this.search(data => data.pos.x2 === x && data.pos.y2 === y)
        const onStart = this.search(data => data.pos.x1 === x && data.pos.y1 === y)
        // const searched = this.search(comparator)
        if (!onEnd) console.log("X2, Y2 not found!!");
        if (!onStart) console.log("X1, Y1 not found!!");
        _log({ onEnd, onStart })
        return { onStart, onEnd }
    }

    public getNodeById(id: string) {
        const node = this.search(data => data.id === id)
        if (!node) return _log("Node with id: ", id, " not found")
        // _log(prev, node, next)
        // _log(`prev: ${node?.prev?.data ?? 'Null'} \ncurrent: ${node?.data ?? 'Not Found'} \nnext: ${node?.next?.data ?? 'Null'}`)
        // * _log("SearchedNodeData: ", node.data)
        return node
    }

    public changeNodeData(comparator: IDataComparator<T>, new_data: Partial<T>): ChainNode<T> | null {
        if (!this.head) return null

        const editNext = (node: ChainNode<T>): ChainNode<T> => {
            for (let Key in new_data) {
                if (comparator(node.data)) { node.edit_data(Key, new_data[Key]!) }
                //* if (typeof new_data[Key] === 'string' || typeof new_data[Key] === 'number') node.data[Key] = new_data[Key]!
                //* else node.data[Key] = { ...node.data[Key], ...new_data[Key] }
                //* node.data = comparator(node.data) ? { ...node.data, ...new_data } : node.data
            }
            return node.next ? editNext(node.next) : node
        }

        return editNext(this.head)
    }

    public chainChangeValue(changeFunc: (data: T) => T) {

        const arr: ReturnType<typeof changeFunc>[] = []

        if (!this.head) return arr

        const mapNext = (node: ChainNode<T>): ChainNode<T> => {
            node.data = changeFunc(node.data)
            return node.next ? mapNext(node.next) : node
        }

        return mapNext(this.head)
    }


    public getBordersCoordsChain(): Point[] {
        const arr: Point[] = []
        if (!this.head) return arr

        const addToArray = (node: ChainNode<T>): Point[] => {
            const [start, end] = getPoints(node.data)
            const last = arr.pop() ?? new Point(0, 0)


            if (last.isEqualTo(start)) arr.push(start, end)

            return node.next ? addToArray(node.next) : arr
        }

        //* сравнение координат конца последнего отрезка и начала первого
        // const last = getLast(this.head).data
        // const [head_start, head_end] = getPoints(this.head.data)
        // const [last_start, last_end] = getPoints(last)
        // console.log('isChain: ', head_end.isEqualTo(last_start))
        return addToArray(this.head)
    }

    public checkChain() {
        if (!this.head) return false

        const checkNext = (node: ChainNode<T>): boolean => {

            if (!this.head) {
                _log('stopped here 1')
                return false
            }


            const last = getLast(this.head)
            const [head_start, head_end] = getPoints(node.data)
            const [last_start, last_end] = getPoints(last.data)

            _log("start: ", last_start, "\nend: ", head_end)
            const isChained = head_end.isEqualTo(last_start)


            // console.log('isChained', Boolean(isChained))
            return (node.next) ? isChained ? checkNext(node.next) : true : true
        }






        return checkNext(this.head)
    }

    sync() {
        if (!this.head) return
        if (this.size() < 3) return
        const last = getLast(this.head)
        const prevNode = this.head.prev ? this.head.prev : last
        const nextNode = this.head.next ? this.head.next : this.head

        const currentNode = this.head
        const { x1, x2, y1, y2 } = currentNode.data.pos

        // prevNode.update_data({ pos: { x1: 111, x2: 222, y1: 333,y2:4 }, id: "sss" })

    }

}



const [t1, t2, t3, t4]: (WithPositionProp & WithId)[] = [
    { pos: { x1: 0, y1: 0, x2: 5, y2: 0 }, id: 't1' },
    { pos: { x1: 5, y1: 0, x2: 5, y2: 10 }, id: 't2' },
    { pos: { x1: 5, y1: 10, x2: 0, y2: 10 }, id: 't3' },
    { pos: { x1: 0, y1: 10, x2: 0, y2: 0 }, id: 't4' },


]
export function test_list(x: number, y: number) {
    const new_data_value = {
        pos: { x1: 555, y1: 555 },
        id: "zzzzzzzzzzzzzzz"
    } as Partial<Partial<InnerCoords & WithId>>
    const CLIST = new CoordsChainList()


    CLIST.push(t1)
    CLIST.push(t2)
    CLIST.push(t3)
    CLIST.push(t4)

    CLIST.getCoordsNode(0, 10)


    CLIST.changeNodeData(
        data => data.id === 't3',
        new_data_value,
        // id: "T3",
    )


    // {...data, pos:{...data.pos, ...new_data.pos}}
    // CLIST.getNodeById('t3')
    CLIST.size()
    // const multiplier_x4 = (a: number) => a * 1
    // CLIST.chainChangeValue(data => {
    //     const [s, e] = getPoints(data)

    //     return {
    //         ...data, pos: {
    //             x1: multiplier_x4(s.x),
    //             x2: multiplier_x4(s.y),
    //             y1: multiplier_x4(e.x),
    //             y2: multiplier_x4(e.y),
    //         }
    //     }
    // })
    // _log(CLIST.traverse().map(r => Object.values(r.position)))
    // CLIST.checkChain()
    CLIST.getBordersCoordsChain()
    // console.log('arr', arr)
    // const search_nodes = CLIST.getCoordsNode(x, y)
    // console.log('CLIST', CLIST.traverse())
    // console.log(`search nodes(${x}, ${y}): `, search_nodes)
    // console.log(`searchnodes(${x}, ${y}).prev: `, searchnode?.data)
    // console.log(`searchnodes(${x}, ${y}).next: `, searchnode?.next?.data)
}

