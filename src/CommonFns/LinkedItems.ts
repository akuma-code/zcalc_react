import { IPoint, InnerCoords, InnerCoordsKeys } from "../Models/BalkaModel/InterfaceBalkaModels"
import { WithId } from "../Types/CalcModuleTypes"
import { _log } from "../hooks/useUtils"
import { _mapID } from "./HelpersFn"
interface IObjectItem<T = any> {
    [key: string]: T
}
export interface WithPositionProp { position: InnerCoords }
export interface IChainListActions<T> {
    push: (data: T) => ChainNode<T>
    prepend: (data: T) => ChainNode<T>
    deleteNode: (node: ChainNode<T>) => void
    traverse(): T[]
    size(): number
    search(comparator: (data: T) => boolean): ChainNode<T> | null
}
export interface IDataComparator<T> {
    (data: T): boolean
}

export type ValueGetter<T = any> = (item: T) => string | number



const getLast = <T>(node: ChainNode<T>): ChainNode<T> => {
    return node.next ? getLast(node.next) : node
}
const checkNext = <T>(node: ChainNode<T>, comparator: IDataComparator<T>): ChainNode<T> | null => {
    if (comparator(node.data)) return node
    return node.next ? checkNext(node.next, comparator) : null
}

const getPoints = <T extends WithPositionProp>(item: T) => {
    const { x1, x2, y1, y2 } = item.position
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
        return this.traverse().length
    }

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

export class CoordsChainList<T extends WithPositionProp & WithId> extends ChainList<T>{

    public getCoordsNode(x: number, y: number) {

        const searchedCoordsAtEnd = this.search(data => data.position.x2 === x && data.position.y2 === y)
        const searchedCoordsAtStart = this.search(data => data.position.x1 === x && data.position.y1 === y)
        // const searched = this.search(comparator)
        if (!searchedCoordsAtEnd) console.log("X2, Y2 not found!!");
        if (!searchedCoordsAtStart) console.log("X1, Y1 not found!!");

        return { searchedCoordsAtStart, searchedCoordsAtEnd }
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

            _log("start: ", last_start, "\nend: ", last_end)
            const isChained = head_end.isEqualTo(last_start)


            // console.log('isChained', Boolean(isChained))
            return (node.next) ? checkNext(node.next) : true
        }






        return checkNext(this.head)
    }



}



const [t1, t2, t3, t4]: (WithPositionProp & { id: string })[] = [
    { position: { x1: 0, y1: 0, x2: 5, y2: 0 }, id: 't1' },
    { position: { x1: 5, y1: 0, x2: 5, y2: 10 }, id: 't2' },
    { position: { x1: 5, y1: 10, x2: 0, y2: 10 }, id: 't3' },
    { position: { x1: 0, y1: 10, x2: 0, y2: 0 }, id: 't4' },


]

export function test_list(x: number, y: number) {

    const CLIST = new CoordsChainList()


    CLIST.push(t1)
    CLIST.push(t2)
    CLIST.push(t3)
    CLIST.push(t4)
    const multiplier_x4 = (a: number) => a * 1
    CLIST.chainChangeValue(data => {
        const [s, e] = getPoints(data)

        return {
            ...data, position: {
                x1: multiplier_x4(s.x),
                x2: multiplier_x4(s.y),
                y1: multiplier_x4(e.x),
                y2: multiplier_x4(e.y),
            }
        }
    })
    // _log(CLIST.traverse().map(r => Object.values(r.position)))
    CLIST.checkChain()
    CLIST.getBordersCoordsChain()
    // console.log('arr', arr)
    // const search_nodes = CLIST.getCoordsNode(x, y)
    // console.log('CLIST', CLIST.traverse())
    // console.log(`search nodes(${x}, ${y}): `, search_nodes)
    // console.log(`searchnodes(${x}, ${y}).prev: `, searchnode?.data)
    // console.log(`searchnodes(${x}, ${y}).next: `, searchnode?.next?.data)
}
