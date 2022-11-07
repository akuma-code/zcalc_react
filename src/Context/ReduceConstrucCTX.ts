import React, { useContext } from 'react'
import { WinFrameModel, WinFrameModel_3 } from '../Models/WinFrameModel'
import { IConstructGrid, IFrameConstruct, IWinFrame, IWinFramePart, IWinFrameRow } from '../Types/FrameTypes'
import { IModelFrame } from '../Types/ModelsTypes'

type IReduceConstCTX = {
    models3: WinFrameModel_3[]
    setModels3: React.Dispatch<React.SetStateAction<[] | WinFrameModel_3[]>>
}


export const ReducerCTX = React.createContext<IReduceConstCTX | null>(null)

export function useConstructCtx() {
    const context = useContext(ReducerCTX)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}

