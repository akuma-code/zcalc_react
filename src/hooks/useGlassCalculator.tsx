import { CalcFormDataExport } from '../CalcModule/Calc_Form';
import { CM_Node, INodeSize, ISideStateValues, ISides2 } from '../Types/CalcModuleTypes';
import GlassDelta, { IProfileSystem } from '../CalcModule/GlassDelta';
import { ISides } from '../Types/CalcModuleTypes';
import { ISide, ISize } from '../Types/FrameTypes';
import { useState } from 'react';
import { useEffect } from 'react'
import { ProfileVeka } from '../Types/Enums';

export function useDelta<T, K extends keyof T>(deltaContainer: T, system: K) {
    const current_delta = deltaContainer[system]
    return { ...current_delta }

}


export function useGlassCalculator(size: INodeSize, system: IProfileSystem, sides: ISides2<keyof typeof ProfileVeka>) {
    const [nSides, setNSides] = useState<ISides2<keyof typeof ProfileVeka>>(sides)
    const [sideVals, setSideVals] = useState({ top: 0, bot: 0, left: 0, right: 0 })
    console.log('nsides: ', nSides);

    const delta = useDelta(GlassDelta, system)
    const { w, h } = size

    useEffect(() => {
        setSideVals(prev => ({ ...prev, ...delta }))

    }, [])

    const gw = w
    const gh = h
    return { gw, gh }
}

// export function CalcGlass(system: IProfileSystem, size: { w: number, h: number }, sides: ISides): { gw: number, gh: number } {

//     const delta = GlassDelta[system]
//     const converted = {
//         ...sides,
//         top: delta[sides.top],
//         bot: delta[sides.bot],
//         left: delta[sides.left],
//         right: delta[sides.right],
//     }

//     const { dW, dH } = { dW: converted.left + converted.right, dH: converted.top + converted.bot }
//     return { gw: size.w - dW, gh: size.h - dH }
// }
