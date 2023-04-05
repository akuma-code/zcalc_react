import GlassDelta, { IProfileSystem } from "../CalcModule/GlassDelta";
import { NodeBorder } from "../Types/CalcModuleTypes";
import React, { useState, useMemo } from 'react'
type NodeBorderDelta<T extends NodeBorder> = {
    [key in keyof T]-?: T[key]
}
export const useBordersDelta = () => {
    const [system, setSystem] = useState('Proline' as IProfileSystem)
    const delta = useMemo(() => {
        return GlassDelta[system]
    }, [system])
    const applyDelta = (border: NodeBorder) => {


    }
    const updateDelta = (system: IProfileSystem) => setSystem(prev => system)

    return { delta, updateDelta } as const
}
export function useNodeBorders(borders: NodeBorder[]) {

}

