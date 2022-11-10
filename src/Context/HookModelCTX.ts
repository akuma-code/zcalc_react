import React, { useContext } from 'react'
import { ConstructionModel } from '../Models/WinFrameHookModel'
import { IHook_Model } from '../Types/ModelsTypes'

type IReduceConstCTX = {
    models: ConstructionModel[]
    setModels: React.Dispatch<React.SetStateAction<[] | ConstructionModel[]>>
    savedModels: any[]
    saveModel: React.Dispatch<React.SetStateAction<[] | any>>
    current?: any
    setCurrent?: React.Dispatch<React.SetStateAction<{} | any>>
}


export const HookModelCTX = React.createContext<IReduceConstCTX | null>(null)

export function useHookContext() {
    const context = useContext(HookModelCTX)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}

