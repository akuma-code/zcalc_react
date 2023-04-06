import GlassDelta, { IProfileSystem } from "../CalcModule/GlassDelta";
import { NodeBorder } from "../Types/CalcModuleTypes";
import React, { useState, useMemo } from 'react'
type AddDeltaProp<T> = {
    [key in keyof T]-?: T[key]
}

type BD = AddDeltaProp<NodeBorder>


export const useBordersDelta = () => {
    const [system, setSystem] = useState('Proline' as IProfileSystem)
    const delta = useMemo(() => {
        return GlassDelta[system]
    }, [system])

    const updateDelta = (system: IProfileSystem) => setSystem(prev => system)

    return { delta, updateDelta }
}
export function useNodeBorders(borders: NodeBorder[]) {
    const { delta, updateDelta } = useBordersDelta()
    const applyDelta = (border: NodeBorder): BD => ({ ...border, delta: delta[border.state]!, desc: "NO" })
    const dbordes: BD[] = borders.map(applyDelta)
    return [dbordes, updateDelta] as const
}

