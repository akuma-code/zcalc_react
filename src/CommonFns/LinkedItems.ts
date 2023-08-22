import { InnerCoords, InnerCoordsKeys, } from "../Models/BalkaModel/InterfaceBalkaModels"
import { EndPoint, Point, StartPoint, _Pt } from "../Models/PointsModel/Point"
import { _log } from "../hooks/useUtils"
import { ConcreteObserver, ConcreteSubject } from "./LinkedCoordsStore"
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

const subject = new ConcreteSubject()

const observer_1 = new ConcreteObserver('observ-1')
const observer_2 = new ConcreteObserver('observ-2')

subject.addObserver(observer_1)
subject.addObserver(observer_2)

//! --------------
//* test function
//! --------------
export function test_list(x: number, y: number) {


    // subject.notifyObservers(new Point(5, 9))

    const CLIST = new CoordsChainList()


    CLIST.push(t1)
    CLIST.push(t2)
    CLIST.push(t3)
    CLIST.push(t4)

    const test_new_data = {
        pos: { x1: 111, x2: 222, y1: 333, y2: 888 },
        // id: "updated",
    } as IPartialChainNodeData

    const rama = createSquareRama(15, 10, _Pt(5, 0))



    // CLIST.changeNodeData(
    //     data => data.id === 't3',
    //     test_new_data,
    // )
    // const n = CLIST.getNodeById('t3')
    // n && n.syncPoints()

}

//? if (typeof new_data[Key] === 'string' || typeof new_data[Key] === 'number') node.data[Key] = new_data[Key]!
//? else node.data[Key] = { ...node.data[Key], ...new_data[Key] }
//? node.data = comparator(node.data) ? { ...node.data, ...new_data } : node.data


function createSquareRama(w = 10, h = 10, startPos: { x: number, y: number } = { x: 0, y: 0 }) {
    const [x, y, ox, oy] = [startPos.x, startPos.y, w, h]
    const line1: [StartPoint, EndPoint] = _Pt(x, y, ox, y)
    const line2: [StartPoint, EndPoint] = _Pt(ox, y, ox, oy)
    const line3: [StartPoint, EndPoint] = _Pt(ox, oy, x, oy)
    const line4: [StartPoint, EndPoint] = _Pt(x, oy, x, y)
    const newbalka = (start: StartPoint, end: EndPoint) => {
        const pos = { ...start, ...end }
        const id = `balk_${start.x1 + start.y1}`
        return { pos, id }
    }
    const rama = new CoordsChainList()
    rama.push(newbalka(...line1))
    rama.push(newbalka(...line2))
    rama.push(newbalka(...line3))
    rama.push(newbalka(...line4))
    return rama
}
