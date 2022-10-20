import React, { useContext } from 'react'
import { IConstructGrid, IFrameConstruct, IWinFrame, IWinFramePart, IWinFrameRow } from '../Types/FrameTypes'

type IConstructorCTX = {
    rows: IWinFrameRow[],
    frames: IWinFrame[],
    parts: IWinFramePart[],
    grid: IConstructGrid[],
    framesList?: IConstructGrid[],
    setRows?: React.Dispatch<React.SetStateAction<[] | IWinFrameRow[]>>
    setParts?: React.Dispatch<React.SetStateAction<[] | IWinFramePart[]>>
    setFrames?: React.Dispatch<React.SetStateAction<[] | IWinFrame[]>>
    setGrid?: React.Dispatch<React.SetStateAction<[] | IConstructGrid[]>>
    setFramesList?: React.Dispatch<React.SetStateAction<[] | IConstructGrid[]>>
}
export const ConstructorContext = React.createContext<IConstructorCTX | null>(null)

export function useConstructCtx() {
    const context = useContext(ConstructorContext)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}