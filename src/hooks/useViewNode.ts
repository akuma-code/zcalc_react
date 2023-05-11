import { CalcNode_v2 } from "../Models/CalcModels/CalcNode.v2";
import { IProfileDelta, ISideStateValues, ISides } from "../Types/CalcModuleTypes";
import { useState, useMemo, useEffect } from 'react'
import { DIRECTION } from "../Types/Enums";
import { CNodeService } from "../Models/CalcModels/CNodeService";


export type NodeActionsType = |
    'join' |
    'devide' |
    'clone' |
    'remove' |
    'changeType' |
    'changeSize' |
    'changeCoords'

export type ModelActionsType = |
    'addImpost' |
    'removeImpost' |
    'connectToModel' |
    'changeSize' |
    'changeCoords' |
    'changeParams'

type ICoords = [number, number, number, number]
type ReturnViewNode = {
    id: string
    borderSides: {
        side: ISides
        border: {
            state: ISideStateValues,
            coords: ICoords
            id: string
        }
    }[]

}

export function useDataExchange(importNode: CalcNode_v2): ReturnViewNode {
    const extractData: ReturnViewNode = useMemo(() => {
        const coords = importNode.Pos.concat(importNode.PosOffset) as ICoords;
        const id = importNode.id
        const borderSides = Object.entries(importNode.borders)
            .map(([s, b]) => ({ side: s as ISides, border: { id: b.id, coords, state: b.state, desc: b.desc } }));



        return { id, coords, borderSides };
    }, [importNode]);
    return extractData
}


// if (scale) return { id, coords: coords.map(n => n * scale), borderSides }
export function useViewNode(calc_node: CalcNode_v2) {
    const [currentNode, setCurrentNode] = useState<CalcNode_v2>(calc_node)
    const [data, setData] = useState<ReturnViewNode>({} as ReturnViewNode)

    useEffect(() => {
        const DATA = (importNode: CalcNode_v2) => {
            const coords = importNode.Pos.concat(importNode.PosOffset) as ICoords;
            const id = importNode.id
            const borderSides = Object.entries(importNode.borders)
                .map(([s, b]) => ({ side: s as ISides, border: { id: b.id, coords, state: b.state, desc: b.desc } }));
            return { id, coords, borderSides }
        }
        if (!data) setData(DATA(currentNode))
        setData(prev => ({ ...prev, ...DATA(currentNode) }))

        return () => setCurrentNode(calc_node)
    }, [currentNode, calc_node])



    const nodeActions = {
        clone: (node: CalcNode_v2) => {
            return new CalcNode_v2(node.size)
                .setPos(...node.Pos)
                .setBorders(node.borders)
        },
        joinSubNodes(...args: CalcNode_v2[]) {
            const [node_main, node_second] = args
            const node = CNodeService.JoinSubNodes(node_main, node_second)
            return node
        },
        devide: (node: Required<CalcNode_v2>) => {
            const subnodes = CNodeService.DevideVertical(node)
            return subnodes
        },


    }


    return [data, nodeActions] as const

}