import React, { useContext } from 'react'
import { IConstructGrid, IFrameConstruct, IWinFrame, IWinFramePart, IWinFrameRow } from '../Types/FrameTypes'

type IConstructorCTX = {
    rows?: IWinFrameRow[],
    frames: IWinFrame[],
    current?: IWinFrame | {},
    parts?: IWinFramePart[],
    grid?: IConstructGrid[],
    savedFrames?: IWinFrame[],
    setRows?: React.Dispatch<React.SetStateAction<[] | IWinFrameRow[]>>
    setParts?: React.Dispatch<React.SetStateAction<[] | IWinFramePart[]>>
    setFrames?: React.Dispatch<React.SetStateAction<[] | IWinFrame[]>>
    setCurrent?: React.Dispatch<React.SetStateAction<{} | IWinFrame>>
    setGrid?: React.Dispatch<React.SetStateAction<[] | IConstructGrid[]>>
    setSavedFrames?: React.Dispatch<React.SetStateAction<[] | IWinFrame[]>>
}
export const ConstructorContext = React.createContext<IConstructorCTX | null>(null)

export function useConstructCtx() {
    const context = useContext(ConstructorContext)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}