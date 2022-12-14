import React, { useContext } from 'react'
import { WinFrameModel, WinFrameModel_3 } from '../_testing_scripts/WinFrameModel'
import { IConstructGrid, IFrameConstruct, IWinFrame, IWinFramePart, IWinFrameRow } from '../Types/FrameTypes'
import { IModelFrame } from '../Types/ModelsTypes'

type IConstructorCTX = {
    rows?: IWinFrameRow[],
    frames: IWinFrame[],
    current?: IWinFrame | {},
    parts?: IWinFramePart[],
    grid?: IConstructGrid[],
    savedFrames?: IWinFrame[],
    wfModels?: WinFrameModel_3[],
    setRows?: React.Dispatch<React.SetStateAction<[] | IWinFrameRow[]>>
    setParts?: React.Dispatch<React.SetStateAction<[] | IWinFramePart[]>>
    setFrames?: React.Dispatch<React.SetStateAction<[] | IWinFrame[]>>
    setCurrent?: React.Dispatch<React.SetStateAction<{} | IWinFrame>>
    setGrid?: React.Dispatch<React.SetStateAction<[] | IConstructGrid[]>>
    setSavedFrames?: React.Dispatch<React.SetStateAction<[] | IWinFrame[]>>
    setWfModels?: React.Dispatch<React.SetStateAction<[] | WinFrameModel_3[]>>
}
export const ConstructorContext = React.createContext<IConstructorCTX | null>(null)

export function useConstructCtx() {
    const context = useContext(ConstructorContext)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}
