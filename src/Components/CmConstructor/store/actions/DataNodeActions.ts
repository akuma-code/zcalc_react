import { ISides, NotNullOBJ } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataNode } from "../../../../Types/DataModelTypes";
import { NODE_ACTIONS_Enum, NodeActionsType } from "../ReducerTypes";

export interface DATA_NODE_ACTIONS_FN {
    CONSUME: (node_main: IDataNode, node_consume?: typeof node_main) => IDataNode
    DEVIDE: (node_main: IDataNode) => readonly [IDataNode, IDataNode]
    CLONE: (node_main: IDataNode) => IDataNode
    REMOVE: (node_main: IDataNode) => void
    SET_PARAMS: (...args: any) => void
    coordsMap: (node_main: IDataNode) => { side: ISides, coords: CoordsTuple }
    coordsMapString: (node_main: IDataNode) => { side: ISides, coords: string }
}


type ACTION_Node_CONSUME = (node_main: IDataNode, node_consume?: typeof node_main) => IDataNode
type ACTION_Node_DEVIDE = (node_main: IDataNode) => readonly [IDataNode, IDataNode]
type ACTION_Node_CLONE = (node_main: IDataNode) => IDataNode
type ACTION_Node_Coords = (node_main: IDataNode) => { side: ISides, coords: CoordsTuple }
type ACTION_Node_CoordsStr = (node_main: IDataNode) => { side: ISides, coords: string }
type ACTIONS_NODE_UNION = ACTION_Node_CONSUME | ACTION_Node_DEVIDE | ACTION_Node_CLONE | ACTION_Node_Coords | ACTION_Node_CoordsStr



export type ACTIONS_NAME = keyof DATA_NODE_ACTIONS_FN
export type DNA_ACTIONS = Record<ACTIONS_NAME, (...args: any) => any>

export type DNA_ACTIONS_Names = Record<ACTIONS_NAME, DATA_NODE_ACTIONS_FN[ACTIONS_NAME]>

export class DataNodeActions {

    actions!: DNA_ACTIONS
    constructor() {

        this.actions = {} as DNA_ACTIONS
        this.use('coordsMap', coordsMap)
        this.use('coordsMapString', coordsMapString)
        console.log('actions: ', this.actions)
    }

    use(name: ACTIONS_NAME, action: DATA_NODE_ACTIONS_FN[ACTIONS_NAME]) {

        this.actions[name] = action
        console.log(` __${name}__ successfuly setted`)
    }

}

function use_main<T, F extends Function>(arg: T, cb: F) {


    return (arg2: any) => cb(arg, arg2)
}



const coordsMap = (node: IDataNode) => {

    const coordsM = node.borders!.map(b => ({ side: b.side!, coords: b.coords! }))
    console.log('cc:', coordsM);

    return coordsM
}




const coordsMapString = (node: IDataNode) => {
    if (!node.borders) return []
    // const coordsNumb = node.borders.map(b => ({ side: b.side!, coords: b.coords! }))
    // const cc = coordsMap(node).map(c => c.coords.map(n => n >= 10 ? n.toString() : '0' + n.toString()).join(''))
    const coordsM = node.borders.map(b => ({ side: b.side!, coords: serializeCoords(...b.coords!).join('') }))
    console.log('coordsM', coordsM)
    return coordsM
}

function serializeCoords(...args: number[]) {
    const maxLength = Math.max(...args).toString().length
    const setPrefix = (n: number) => {
        const nlength = n.toString().length
        const res = maxLength - nlength
        let arr: string[] = []
        if (res > 0) {
            arr.length = res
            arr.fill('0')
        }
        const strN = n.toString()
        arr.push(strN)
        const withPrfx = arr.join('')

        return withPrfx
    }
    const strArr = args.map(n => setPrefix(n))
    return strArr
}
