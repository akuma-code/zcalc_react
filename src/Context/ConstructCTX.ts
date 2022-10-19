import React, { useContext } from 'react'
import { IConstructGrid, IFrameConstruct } from '../Types/FrameTypes'

type IConstructorCTX = {
    frames: { posNumb: number }[],
    grid: { row: number, cols: number }[]
    constructList?: IConstructGrid[]
    setFrames?: React.Dispatch<React.SetStateAction<[] | IFrameConstruct[]>>
    setGrid?: React.Dispatch<React.SetStateAction<[] | IConstructGrid[]>>
    setConstructList?: React.Dispatch<React.SetStateAction<[] | IConstructGrid[]>>
}
export const ConstructorContext = React.createContext<IConstructorCTX | null>(null)

export function useConstructCtx() {
    const context = useContext(ConstructorContext)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}