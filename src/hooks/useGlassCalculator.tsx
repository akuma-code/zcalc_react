import { CalcFormDataExport } from '../CalcModule/Calc_Form';
import { CM_Node, INodeSize, ISideStateValues, ISides2, ISidesArray } from '../Types/CalcModuleTypes';
import GlassDelta, { IProfileSystem } from '../CalcModule/GlassDelta';
import { ISides } from '../Types/CalcModuleTypes';
import { ISide, ISize } from '../Types/FrameTypes';
import { useState } from 'react';
import { useEffect } from 'react'
import { PROFILE } from '../Types/Enums';




export function useGlassCalculator(size: INodeSize, system: IProfileSystem, sides: ISides2<keyof typeof PROFILE>) {
    const delta = useDelta(GlassDelta, system)
    const [nSides, setNSides] = useState<ISides2<keyof typeof PROFILE>>(sides)
    console.log('nsides: ', nSides);

    const { w, h } = size

    useEffect(() => {


    }, [])

    const gw = w
    const gh = h
    return { gw, gh }
}
export function useDelta<T, K extends keyof T>(deltaContainer: T, system: K) {
    const current_delta = deltaContainer[system]
    return {
        system: system,
        values: current_delta
    } as const
}
export function getValue<T>(state: keyof typeof delta, delta: T) {


    return delta[state]
}

