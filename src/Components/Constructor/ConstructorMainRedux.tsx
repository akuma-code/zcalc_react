import React, { useState, useMemo } from 'react'
import { HookModelCTX } from '../../Context/HookModelCTX'
import { useUtils } from '../../hooks/useUtils'
import { useViewFrameModel } from '../../hooks/useViewFrameModel'
import { FStore } from '../../Store/FrameStore'
import { DivProps } from '../../Types'
import { IFrameStoreItem } from '../../Types/FStoreTypes'
import Button from '../UI/Button'
import { ConstructionView, IFrame, IHFramesSet } from './FramesSet'

const genID = useUtils.stringID




export const ConstructorMainRedux = (): JSX.Element => {
    const [VFramesSet, setVFSet] = useState([])
    //! переделать в стейт подготовки модели к експорту
    const [editInfo, setInfo] = useState({})
    const [savedModels, saveModel] = useState([] as typeof ViewModel[])
    const [ViewModel, setVM] = useViewFrameModel({} as IHFramesSet)


    const SAVE = (view_model: IHFramesSet) => {
        if (savedModels.every(m => m.id !== view_model.id)) saveModel(prep => ([...prep, view_model]))
        else saveModel(m => m.map(vm => vm.id === view_model.id ? ({ ...vm, ...view_model }) : vm))
        return console.log('saved: ', savedModels[savedModels.length - 1])
    }


    const SideControlButtons = useMemo(() => (
        <div className='bg-orange-800 flex flex-col divide-y px-2'>
            <h3 className='text-2xl'>Control Panel</h3>
            <button
                className="h-14 px-4 my-2 font-semibold rounded-md bg-cyan-600 text-white
                            active:bg-blue-50 active:text-black"
                onClick={setVM.CreateViewFrame}
            >Новое изделие
            </button>
            <Button bg='#11b434'
                onClickFn={() => SAVE(ViewModel)}
            >
                Сохранить
            </Button>
            <Button bg='#2b2206'
                onClickFn={() => setVM.LoadViewModel(savedModels[savedModels.length - 1])}
            >
                Загрузить последнее
            </Button>

            <button
                className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                onClick={setVM.ClearFrames}
            >Очистить конструктор
            </button>
        </div>
    ), [savedModels, ViewModel])


    return (
        <HookModelCTX.Provider
            value={{
                // FullConstruction, setFullConstruction,
                editInfo, setInfo,
                savedModels, saveModel,
                ViewModel, setVM,
            }}
        >


            <div className='flex-col text-center m-1'>
                <b className="text-4xl">Конструктор</b>
                <div className='divide-x-4 columns-2 flex mt-3'>

                    {SideControlButtons}
                    <div className='bg-orange-400 divide-y-2'>
                        <span className='text-2xl p-1 m-1'>
                            CanvasLayout
                        </span>
                        <Canvas >
                            <ConstructionView {...ViewModel} />
                        </Canvas>
                    </div>
                </div>
            </div>
        </HookModelCTX.Provider>
    )
}


const Canvas: React.FC<{ children?: React.ReactNode } & DivProps> = ({ children }) => {

    return (
        <div className='bg-slate-200  items-start flex flex-col min-h-[30em]  min-w-[30em] px-16 py-16 z-22'
        >
            {children}
        </div>
    )
}

let count = 0
const SaveToStore = (modelsConstruction: IFrame[]) => {
    const newfsItem = (name?: string) => {
        const frName = name || prompt('Input Construction Name') || 'NONAME_' + count || `frame_#${genID()}`
        const item: IFrameStoreItem = {
            id: genID(),
            frameName: frName,
            frameBox: [...modelsConstruction]
        }
        count++
        return item
    }
    FStore.save([newfsItem()])
    return FStore
}



