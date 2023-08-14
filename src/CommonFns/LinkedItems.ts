import { InnerCoords, InnerCoordsKeys } from "../Models/BalkaModel/InterfaceBalkaModels"
import { _log } from "../hooks/useUtils"
import { _mapID } from "./HelpersFn"

export interface WithPositionProp { position: InnerCoords }
export interface IChainListActions<T> {
    push: (data: T) => ChainingNode<T>
    prepend: (data: T) => ChainingNode<T>
    deleteNode: (node: ChainingNode<T>) => void
    traverse(): T[]
    size(): number
    search(comparator: (data: T) => boolean): ChainingNode<T> | null
}
const getLast = <T>(node: ChainingNode<T>): ChainingNode<T> => {
    return node.next ? getLast(node.next) : node
}
class ChainingNode<T> {
    public next: ChainingNode<T> | null = null
    public prev: ChainingNode<T> | null = null

    constructor(public data: T) { }
}

class ChainList<T> implements IChainListActions<T>{
    public head: ChainingNode<T> | null = null

    public push(data: T): ChainingNode<T> {
        const node = new ChainingNode(data)
        if (!this.head) {
            this.head = node
        } else {
            const lastNode = getLast(this.head)
            lastNode.next = this.head
            node.prev = lastNode
            this.head = node
        }

        return node
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
type compResult = {
    isSuccessStart: boolean
    isSuccessEnd: boolean

}

export class CoordsChainList<T extends WithPositionProp> extends ChainList<T>{

    public getCoordsNode(x: number, y: number) {

        const comparator = (data: ChainingNode<T>['data']) => {
            // console.log('data', data)
            const { x1, x2, y1, y2 } = data.position
            if (x1 === x && y1 === y) {
                _log(`x1: ${x1}, y1: ${y1}`)
                return true
            } else
                if (x2 === x && y2 === y) {
                    _log(`x2: ${x2}, y2: ${y2}`)
                    return true
                }
            return false
        }

        const searched = this.search(comparator)
        console.log('searched', searched)


        return searched
    }
}

export function test_list(x: number, y: number) {

    const CLIST = new CoordsChainList()

    const [t1, t2, t3, t4]: (WithPositionProp & { id: string })[] = [
        { position: { x1: 0, y1: 0, x2: 5, y2: 0 }, id: 't1' },
        { position: { x1: 5, y1: 0, x2: 5, y2: 10 }, id: 't2' },
        { position: { x1: 5, y1: 10, x2: 0, y2: 10 }, id: 't3' },
        { position: { x1: 0, y1: 10, x2: 0, y2: 0 }, id: 't4' },


    ]

    CLIST.push(t1)
    CLIST.push(t2)
    CLIST.push(t3)
    // CLIST.push(t4)
    console.log('CLIST', CLIST.head)
    const searchnode = CLIST.getCoordsNode(x, y)
    // console.log(`searchnodes(${x}, ${y}): `, searchnode?.data)
    console.log(`searchnodes(${x}, ${y}).prev: `, searchnode?.prev?.data)
    console.log(`searchnodes(${x}, ${y}).next: `, searchnode?.next?.data)
}
