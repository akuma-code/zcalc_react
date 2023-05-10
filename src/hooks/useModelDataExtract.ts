import { useState, useEffect, useMemo } from "react";
import { CalcModel_v2 } from "../Models/CalcModels/CalcModel.v2";
import { Size } from "../Models/CalcModels/Size";
import { CalcNode_v2 } from "../Models/CalcModels/CalcNode.v2";

type ModelData = {
    id: string
    size: Size
    nodes: CalcNode_v2[]
    baseNode: CalcNode_v2
    coords: Record<'x' | 'y' | 'ox' | 'oy', number>
}
export function useModelDataExtract(calc_model: CalcModel_v2) {
    // const [modelData, setModelData] = useState<ModelData | {}>({})
    const data = (m: CalcModel_v2) => {
        const { id, size, nodes, baseNode, Coords } = m

        return {
            id: id,
            size: size,
            nodes: nodes || [],
            baseNode: baseNode,
            coords: Coords,
        }
    }
    const returndata = useMemo(() => data(calc_model), [calc_model])
    return returndata
}