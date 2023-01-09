import React, { useContext } from 'react'
import { IHFramesSet, ViewModelActions } from '../Components/Constructor/FramesSet'
import { IGridConstProps } from '../Components/Constructor/FramesSet'

type IReduceConstCTX = {
    models?: IGridConstProps[]
    setModels?: React.Dispatch<React.SetStateAction<[] | IGridConstProps[]>>
    savedModels: any[]
    saveModel: React.Dispatch<React.SetStateAction<[] | any>>
    editInfo: any
    setInfo: React.Dispatch<React.SetStateAction<{} | any>>
    FullConstruction?: IHFramesSet
    setFullConstruction?: React.Dispatch<React.SetStateAction<IHFramesSet>>
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

