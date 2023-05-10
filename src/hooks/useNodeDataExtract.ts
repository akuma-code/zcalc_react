import { useMemo } from "react";
import { CalcNode_v2 } from "../Models/CalcModels/CalcNode.v2";
import { ISides2 } from "../Types/CalcModuleTypes";


export function useNodeDataExtract_v2(node: CalcNode_v2, scale?: number) {
    const extract = useMemo(() => {
        const coords = node.Pos.concat(node.PosOffset);
        const borders = Object.entries(node.borders).map(([s, b]) => ({ side: s as ISides2, border: b }));

        if (scale) return { coords: coords.map(n => n * scale), borders }

        return { coords, borders };
    }, [node, scale]);
    return { id: node.id, ...extract };

}
