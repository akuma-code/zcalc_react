import { IPoint, InnerCoords, InnerCoordsKeys } from "../Models/BalkaModel/InterfaceBalkaModels"
import { _log } from "../hooks/useUtils"
interface IObjectItem<T = any> {
    [key: string]: T
}
export interface IChainCoordsData {
    pos: InnerCoords
    id: string
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
export interface IDataComparator<T> { (data: Partial<T>): boolean }

export type ValueGetter<T = any> = (item: T) => string | number
export type SetPartialProps<T> = Partial<{ [K in keyof T]: T[K] extends infer R ? Partial<R> : never }>

type IPartialChainNodeData = SetPartialProps<IChainCoordsData>


// export type SetPartialProps<T> = { [K in keyof T]: T[K] extends string | number ? T[K] : Partial<T[K]> }
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never
type InferPartialProps<T> = Partial<T> extends infer R ? Partial<R> : never




const getLast = <T>(node: ChainNode<T>): ChainNode<T> => {
    return node.next ? getLast(node.next) : node
}
const getFirst = <T>(node: ChainNode<T>): ChainNode<T> => node.prev ? getFirst(node.prev) : node

const findNode = <T>(node: ChainNode<T>, comparator: IDataComparator<T>): ChainNode<T> | null => {
    if (comparator(node.data)) return node
    return node.next ? findNode(node.next, comparator) : null
}
const getPoints = <T extends Partial<WithPositionProp>>(item: T) => {
    const { x1, x2, y1, y2 } = item.pos!
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

    private changeDataProperty<K extends keyof T>(propKey: K, propValue: Partial<T[K]>): ChainNode<T> {
        if (typeof propValue === 'string' || typeof propValue === 'number') this.data = { ...this.data, [propKey]: propValue }
        else this.data = { ...this.data, [propKey]: { ...this.data[propKey], ...propValue } }
        return this
    }


    public data_edit(new_data_value: SetPartialProps<T>) {
        for (let K in new_data_value) this.changeDataProperty(K, new_data_value[K]!)
    }



    public syncPoints() {
        const next = this.next ? this.next : getFirst(this)
        const prev = this.prev ? this.prev : getLast(this)
        const [start, end] = getPoints(this.data!)
        const prevData = { pos: { x2: start.x, y2: start.y } } as SetPartialProps<T>
        const nextData = { pos: { x1: end.x, y1: end.y } } as SetPartialProps<T>
        prev.data_edit(prevData)
        next.data_edit(nextData)

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
export class CoordsChainList<T extends IChainCoordsData> extends ChainList<T>{

    public getCoordsNode(x: number, y: number) {

        const onEnd = this.search(data => data.pos.x2 === x && data.pos.y2 === y)
        const onStart = this.search(data => data.pos.x1 === x && data.pos.y1 === y)
        // const searched = this.search(comparator)
        if (!onEnd) console.log("X2, Y2 not found!!");
        if (!onStart) console.log("X1, Y1 not found!!");
        _log({ onEnd, onStart })
        return { onStart, onEnd }
    }

    public getNodeById(id: string): ChainNode<T> | void {
        const node = this.search(data => data.id === id)
        if (!node) return _log("Node with id: ", id, " not found")
        // _log(prev, node, next)
        // _log(`prev: ${node?.prev?.data ?? 'Null'} \ncurrent: ${node?.data ?? 'Not Found'} \nnext: ${node?.next?.data ?? 'Null'}`)
        // * _log("SearchedNodeData: ", node.data)
        return node
    }

    public changeNodeData(comparator: IDataComparator<T>, new_data: SetPartialProps<T>): ChainNode<T> | null {
        if (!this.head) return null

        const editNext = (node: ChainNode<T>): ChainNode<T> => {
            if (comparator(node.data)) node.data_edit(new_data)
            return node.next ? editNext(node.next) : node
        }

        return editNext(this.head)
    }

    public chainMap(changeFunc: (data: T) => T) {

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


}



const [t1, t2, t3, t4]: IChainCoordsData[] = [
    { pos: { x1: 0, y1: 0, x2: 5, y2: 0 }, id: 't1' },
    { pos: { x1: 5, y1: 0, x2: 5, y2: 10 }, id: 't2' },
    { pos: { x1: 5, y1: 10, x2: 0, y2: 10 }, id: 't3' },
    { pos: { x1: 0, y1: 10, x2: 0, y2: 0 }, id: 't4' },


]
export function test_list(x: number, y: number) {

    const CLIST = new CoordsChainList()


    CLIST.push(t1)
    CLIST.push(t2)
    CLIST.push(t3)
    CLIST.push(t4)

    const test_new_data = {
        pos: { x1: 111, x2: 222, y1: 333, y2: 888 },
        // id: "updated",
    } as IPartialChainNodeData


    CLIST.changeNodeData(
        data => data.id === 't3',
        test_new_data,
    )
    const n = CLIST.getNodeById('t3')
    n && n.syncPoints()
    // _log("first:", getFirst(CLIST.head!).data.id)
    // _log("last:", getLast(CLIST.head!).data.id)
    CLIST.size()
    // {...data, pos:{...data.pos, ...new_data.pos}}
    // CLIST.getNodeById('t3')
    // CLIST.size()
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
    // CLIST.getBordersCoordsChain()
    // console.log('arr', arr)
    // const search_nodes = CLIST.getCoordsNode(x, y)
    // console.log('CLIST', CLIST.traverse())
    // console.log(`search nodes(${x}, ${y}): `, search_nodes)
    // console.log(`searchnodes(${x}, ${y}).prev: `, searchnode?.data)
    // console.log(`searchnodes(${x}, ${y}).next: `, searchnode?.next?.data)
}

//? if (typeof new_data[Key] === 'string' || typeof new_data[Key] === 'number') node.data[Key] = new_data[Key]!
                //? else node.data[Key] = { ...node.data[Key], ...new_data[Key] }
                //? node.data = comparator(node.data) ? { ...node.data, ...new_data } : node.data