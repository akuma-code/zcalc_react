import React, { useContext } from 'react'
import { IHFramesSet, IViewFrame, ViewModelActions } from '../Components/Constructor/ConstructorMainRedux'
import { IGridConstProps } from '../Components/Constructor/FramesSet'
import { ConstructionModel } from '../Models/WinFrameHookModel'
import { IHook_Model } from '../Types/ModelsTypes'

type IReduceConstCTX = {
    models: IGridConstProps[]
    setModels: React.Dispatch<React.SetStateAction<[] | IGridConstProps[]>>
    savedModels: any[]
    saveModel: React.Dispatch<React.SetStateAction<[] | any>>
    current: any
    setCurrent: React.Dispatch<React.SetStateAction<{} | any>>
    FullConstruction: IHFramesSet
    setFullConstruction: React.Dispatch<React.SetStateAction<IHFramesSet>>
    ViewModel: IHFramesSet
    setVM: ViewModelActions
}


export const HookModelCTX = React.createContext<IReduceConstCTX | null>(null)

export function useHookContext() {
    const context = useContext(HookModelCTX)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}

