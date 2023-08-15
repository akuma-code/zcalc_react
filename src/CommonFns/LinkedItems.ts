import { IPoint, InnerCoords, InnerCoordsKeys } from "../Models/BalkaModel/InterfaceBalkaModels"
import { WithId } from "../Types/CalcModuleTypes"
import { _log } from "../hooks/useUtils"
import { _mapID } from "./HelpersFn"
interface IObjectItem<T = any> {
    [key: string]: T
}
export interface WithPositionProp { position: InnerCoords }
export interface IChainListActions<T> {
    push: (data: T) => ChainingNode<T>
    prepend: (data: T) => ChainingNode<T>
    deleteNode: (node: ChainingNode<T>) => void
    traverse(): T[]
    size(): number
    search(comparator: (data: T) => boolean): ChainingNode<T> | null
}
export interface IDataComparator<T> {
    (data: T): boolean
}

export type ValueGetter<T = any> = (item: T) => string | number



const getLast = <T>(node: ChainingNode<T>): ChainingNode<T> => {
    return node.next ? getLast(node.next) : node
}
const checkNext = <T>(node: ChainingNode<T>, comparator: IDataComparator<T>): ChainingNode<T> | null => {
    if (comparator(node.data)) return node
    return node.next ? checkNext(node.next, comparator) : null
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

class ChainingNode<T> {
    public next: ChainingNode<T> | null = null
    public prev: ChainingNode<T> | null = null

    constructor(public data: T) { }
}

class ChainList<T> implements IChainListActions<T>{
    public head: ChainingNode<T> | null = null

    public push(data: T): ChainingNode<T> {
        const node = new ChainingNode(data);
        if (!this.head) {
            this.head = node;
        } else {
            const getLast = (node: ChainingNode<T>): ChainingNode<T> => {
                return node.next ? getLast(node.next) : node;
            };

            const lastNode = getLast(this.head);
            lastNode.next = node;
            node.prev = lastNode;
        }
        return node;
    }

    public prepend(data: T): ChainingNode<T> {
        const node = new ChainingNode(data)
        if (!this.head) {
            this.head = node

        } else {
            this.head.prev = node
            node.next = this.head
            this.head = node
        }

        return node
    }

    public deleteNode(node: ChainingNode<T>): void {
        if (!node.prev) {
            this.head = node.next
        } else {
            const prevNode = node.prev
            prevNode.next = node.next
        }
    }

    public search(comparator: (data: T) => boolean): ChainingNode<T> | null {
        const checkNext = (node: ChainingNode<T>): ChainingNode<T> | null => {
            if (comparator(node.data)) return node
            return node.next ? checkNext(node.next) : null
        }

        return this.head ? checkNext(this.head) : null
    }

    public traverse(): T[] {
        const arr: T[] = []
        if (!this.head) return arr

        const addToArray = (node: ChainingNode<T>): T[] => {
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
    prev: ChainingNode<T> | null
    next: ChainingNode<T> | null
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


        // console.log('searched', searchedCoordsAtStart?.data, searchedCoordsAtEnd?.data)
        return { searchedCoordsAtStart, searchedCoordsAtEnd }
    }
    public mapNext(fn: (data: T) => unknown | void) {
        const arr: ReturnType<typeof fn>[] = []
        if (!this.head) return arr
        const mapNext = (node: ChainingNode<T>): typeof arr => {

            arr.push(fn(node.data))
            return node.next ? mapNext(node.next) : arr
        }

        return mapNext(this.head)
    }
    public getCoordsChain(): Point[] {
        const arr: Point[] = []
        if (!this.head) return arr

        const addToArray = (node: ChainingNode<T>): Point[] => {
            const { x1, x2, y1, y2 } = node.data.position
            const [start, end] = [new Point(x1, y1), new Point(x2, y2)]
            arr.push(start, end)
            return node.next ? addToArray(node.next) : arr
        }
        return addToArray(this.head)
    }
}
const mapChain = () => { }



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
    _log(CLIST.getCoordsChain())
    CLIST.mapNext(data => _log(data?.id))
    // const search_nodes = CLIST.getCoordsNode(x, y)
    // console.log('CLIST', CLIST.traverse())
    // console.log(`search nodes(${x}, ${y}): `, search_nodes)
    // console.log(`searchnodes(${x}, ${y}).prev: `, searchnode?.data)
    // console.log(`searchnodes(${x}, ${y}).next: `, searchnode?.next?.data)
}
