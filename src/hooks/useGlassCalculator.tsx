import { CalcFormDataExport } from '../CalcModule/Calc_Form';
import { CM_Node, INodeSize } from '../Types/CalcModuleTypes';
import GlassDelta, { IProfileSystem } from '../CalcModule/GlassDelta';
import { ISides } from '../Types/CalcModuleTypes';
import { ISide, ISize } from '../Types/FrameTypes';
import { useState } from 'react';

type DeltaVals = typeof GlassDelta[IProfileSystem]
function DeltaContainer(system: IProfileSystem): DeltaVals {
    const delta = GlassDelta[system]
    return delta
}
export function useDelta<T, K extends keyof T>(deltaContainer: T, system: K) {
    const current_delta = deltaContainer[system]
    return { ...current_delta }

}


export function useGlassCalculator(size: INodeSize, system: IProfileSystem, sides: ISides) {
    const [nSides, setNSides] = useState<ISides>(sides)

    const delta = useDelta(GlassDelta, system)
    const { w, h } = size

    // const convert = (nodeSide: keyof DeltaVals) => {
    //     const value = DeltaContainer(system)[nodeSide as keyof DeltaVals]
    //     return value
    // }
    // const ds = {
    //     bot: delta[sides.bot] || 0,
    //     top: convert(sides.top) || 0,
    //     left: convert(sides.left) || 0,
    //     right: convert(sides.right) || 0,
    // }
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