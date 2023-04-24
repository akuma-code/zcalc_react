import GlassDelta, { IProfileSystem } from "../CalcModule/GlassDelta";
import { IModelDelta, ISideStateValues, INodeBorder } from "../Types/CalcModuleTypes";
import { useState, useMemo } from 'react'
import { BORDER } from "../Types/Enums";


type BD = Required<INodeBorder>
export const useBordersDelta = () => {
    const [system, setSystem] = useState('Proline' as IProfileSystem)
    const delta = useMemo(() => {
        return GlassDelta[system]
    }, [system])

    const updateDelta = (system: IProfileSystem) => setSystem(prev => system)

    return { delta, updateDelta }
}


export function useNodeBorders(borders?: INodeBorder[]) {
    const { delta, updateDelta } = useBordersDelta()
    if (!borders) return { delta, updateDelta } as const

    const applyDelta = (border: INodeBorder & { state: ISideStateValues }): BD => ({ ...border, delta: delta[border.state]!, desc: BORDER[border.state as keyof typeof BORDER] })
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

export function validateBorderState(border: INodeBorder, delta: IModelDelta): ISideStateValues {
    const { state } = border
    if (!state) throw new Error("border state not defined!");

    const Aviable = Object.keys(delta) as ISideStateValues[]

    if (Aviable.includes(state)) return state
    console.log(`Warning! ${border.side} state changed to STV_IMP`)
    return 'stv_imp'
}