import React, { useState, useEffect, useMemo } from 'react'
import { HookModelCTX, useHookContext } from '../../Context/HookModelCTX'
import { useToggle } from '../../hooks/useToggle'
import { ConstEncode, useUtils } from '../../hooks/useUtils'
import { useViewFrameModel } from '../../hooks/useViewFrameModel'
import { FramesLib, FStore } from '../../Store/FrameStore'
import { DivProps } from '../../Types'
import { IFrameStoreItem } from '../../Types/FStoreTypes'
import { IFrameRow } from '../../Types/ModelsTypes'
import Button from '../UI/Button'
import { FramePreset } from './FramePreset'
import FramesSet, { FullConstructView, IFrame, IHFramesSet, IViewFrame } from './FramesSet'

interface ISavedModel {
    id: string
    rows: IFrameRow[]
    frCode?: string
}

const genID = useUtils.stringID




export const ConstructorMainRedux = (): JSX.Element => {
    const [VFramesSet, setVFSet] = useState<IFrame[] | []>([])
    const [current, setCurrent] = useState({ VFSets: [] as IViewFrame[] })
    const [savedModels, saveModel] = useState([] as ISavedModel[])
    const [FullConstruction, setFullConstruction] = useState<IHFramesSet>({} as IHFramesSet)
    const [ViewModel, setVM] = useViewFrameModel(FullConstruction)


    const newFrame = () => {
        setVM.CreateViewFrame()

    }
    const SAVE = (models: IFrame[]) => {
        const code = ConstEncode(models)
        const prep = models.map(frame => ({ ...frame, frCode: code }))
        SaveToStore(prep)
        FramesLib.addFrames(models)
        saveModel(models)
    }
    const LoadLSFrames = () => {
        const frames = localStorage.getItem('store_FStore1') || ""
        const parsed = JSON.parse(frames)
        if (parsed) {
            const [box] = parsed.map((f: IFrameStoreItem) => ([...f.frameBox]))
            console.log('loaded items', box);
            saveModel(() => [...box])
        }
    }

    // useEffect(() => {
    //     LoadLSFrames()
    //     return () => setVFSet([])

    // }, [])


    return (
        <HookModelCTX.Provider
            value={{
                FullConstruction, setFullConstruction,
                models: VFramesSet, setModels: setVFSet,
                current, setCurrent,
                savedModels, saveModel,
                ViewModel, setVM,
            }}
        >


            <div className='flex-col text-center m-1'>
                <b className="text-4xl">Конструктор</b>
                <div className='divide-x-4 columns-2 flex mt-3'>

                    <div className='bg-orange-800 flex flex-col divide-y px-2'>
                        <h3 className='text-2xl'>Control Panel</h3>
                        <button
                            className="h-14 px-4 my-2 font-semibold rounded-md bg-cyan-600 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={newFrame}
                        >Новое изделие
                        </button>
                        {/* <button disabled
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-200 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={() => { }}
                        >Добавить раму
                        </button> */}

                        <Button bg='#11b434'
                            onClickFn={() => SAVE(VFramesSet)}
                            disabled={true}
                        >
                            Сохранить
                        </Button>
                        <Button bg='#2b2206'
                            onClickFn={() => setVFSet(savedModels)}
                            disabled={true}
                        >
                            Загрузить последнее
                        </Button>

                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            // onClick={() => setFullConstruction((prev: any) => ({ ...prev, ...blankView }))}
                            onClick={setVM.ClearFrames}
                        >Очистить конструктор
                        </button>


                    </div>
                    <div className='bg-orange-400 divide-y-2'>
                        <span className='text-2xl p-1 m-1'>
                            CanvasLayout
                        </span>
                        <Canvas>
                            <FullConstructView {...ViewModel} />
                        </Canvas>
                    </div>
                </div>
            </div>
        </HookModelCTX.Provider>
    )
}


const Canvas: React.FC<{ children?: React.ReactNode } & DivProps> = ({ children }) => {
    const { current, setCurrent } = useHookContext()
    const resetSelect = (e: any) => {
        e?.preventDefault()
        setCurrent((c: typeof current) => (current.isEditing ? {
            ...c,
            selectedFrame: "",
            selectedFrameSet: "",
            isEditing: false
        }
            : c))
    }
    return (
        <div className='bg-slate-200  items-start flex flex-col min-h-[30em]  min-w-[30em] px-16 py-16'
            onContextMenu={(e) => resetSelect(e)}
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


export class ViewFactory {
    static VFramesSet(frames_set: IViewFrame, isSel?: boolean) {

        const res = frames_set.frames.map((f) => (<FramesSet {...f} key={f.id} className='hover:bg-[red] z-10' isSelected={isSel || false} />))
        // const res = useMemo(() => frames_set.view.map((f) => (<FramesSet {...f} key={f.id} className='hover:bg-[red] z-10' isSelected={isSel} />)), [frames_set, isSel])
        return res

    }


}


