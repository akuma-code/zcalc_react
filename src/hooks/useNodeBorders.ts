import GlassDelta, { IProfileSystem } from "../CalcModule/GlassDelta";
import { IProfileDelta, ISideStateValues, NodeBorder } from "../Types/CalcModuleTypes";
import { useState, useMemo } from 'react'
import { BORDER } from "../Types/Enums";


type BD = Required<NodeBorder>
export const useBordersDelta = () => {
    const [system, setSystem] = useState('Proline' as IProfileSystem)
    const delta = useMemo(() => {
        return GlassDelta[system]
    }, [system])

    const updateDelta = (system: IProfileSystem) => setSystem(prev => system)

    return { delta, updateDelta }
}


export function useNodeBorders(borders?: NodeBorder[]) {
    const { delta, updateDelta } = useBordersDelta()
    if (!borders) return { delta, updateDelta } as const

    const applyDelta = (border: NodeBorder): BD => ({ ...border, delta: delta[border.state]!, desc: BORDER[border.state as keyof typeof BORDER] })
    const ValidBorders = borders.map(b => {
        const validState = validateBorderState(b, delta)
        return { ...b, state: validState }
    })
    const Borders: BD[] = ValidBorders.map(applyDelta)
    const dw_dh = (brds: typeof Borders) => {
        return brds!.reduce((dwdh, b) => {

            if (b.side === 'top' || b.side === 'bot') dwdh.dh = dwdh.dh + b.delta
            if (b.side === 'left' || b.side === 'right') dwdh.dw = dwdh.dw + b.delta
            return dwdh
        }, { dw: 0, dh: 0 })
    }
    const dwdh = dw_dh(Borders)
    return { Borders, updateDelta, delta, dwdh } as const
}

export function validateBorderState(border: NodeBorder, delta: IProfileDelta): ISideStateValues {
    const { state } = border
    const Aviable = Object.keys(delta) as ISideStateValues[]

    if (Aviable.includes(state)) return state
    console.log(`Warning! ${border.side} state changed to STV_IMP`)
    return 'stv_imp'
}