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
import FramesSet, { IFrame } from './FramesSet'

const viewConstPreset = {
    "id": "000",
    "title": "view_preset",
    "VFSets": [FramePreset.ONE_ONE, FramePreset.TWO]
} as IHFramesSet

interface ISavedModel {
    id: string
    rows: IFrameRow[]
    frCode?: string
}
export interface IHFramesSet {
    VFSets: IViewFrame[]
    id: string
    title?: string
}

export interface IViewFrame {
    id: string
    frames: IFrame[]
    title?: string
    isSelected?: boolean
}
export type ViewModelActions = {
    DeleteViewFrame: (vf_id: string) => void
    AddViewFrameRight: () => void
    AddViewFrameTop: (vf_id: string) => void
    RemLastViewFrameTop: (vf_id: string) => void
    RemLastViewFrame: () => void
    CreateViewFrame: () => void
    ClearFrames: () => void

}
const genID = useUtils.stringID



const FullConstructView: React.FC<IHFramesSet> = (VModel) => {
    const { current, setCurrent } = useHookContext()
    const { title, VFSets } = VModel
    const selectCurrent = (fs_id: string, f_id: string) => {
        setCurrent && setCurrent((prev: any) => ({
            ...prev,
            vf_id: fs_id,
            selectedID: f_id
        }))
        const vf_ids = VModel.VFSets.map(v => v.id)



    }

    return (
        <div>
            {title}
            <HStack>
                {
                    VFSets?.map((fs) =>
                        <VStack key={fs.id} className=''
                        >
                            {
                                fs.frames.map((f) => (
                                    <FramesSet
                                        id={f.id}
                                        rows={f.rows}
                                        key={f.id}
                                        isSelected={f.id === current.selectedID}
                                        onClickFn={() => selectCurrent(fs.id, f.id)}

                                    />))
                            }
                        </VStack>

                    )}
            </HStack>
        </div>

    )
}
type VStackProps = {
    children?: React.ReactNode
    isSelected?: boolean
} & DivProps
const VStack: React.FC<VStackProps> = ({ children, className }) => {
    const cls = className ? 'flex flex-col-reverse ' + className : 'flex flex-col-reverse  z-0'
    return (
        <div className={cls}>
            {children}
        </div>
    )
}
const HStack: React.FC<{ children?: React.ReactNode } & DivProps> = ({ children }) => {
    return (
        <div className='flex'>
            {children}
        </div>
    )
}


export const ConstructorMainRedux = (): JSX.Element => {
    const [VFramesSet, setVFSet] = useState<IFrame[] | []>([])
    const [current, setCurrent] = useState({ VFSets: [] as IViewFrame[] })
    const [savedModels, saveModel] = useState([] as ISavedModel[])
    const [FullConstruction, setFullConstruction] = useState<IHFramesSet>({} as IHFramesSet)
    const [ViewModel, setVM] = useViewFrameModel(FullConstruction)


    const FrameRight = () => {

        setVM.AddViewFrameRight()
    }

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
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-cyan-600 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={newFrame}
                        >Новое изделие
                        </button>
                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={FrameRight}
                        >Добавить раму
                        </button>

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
                    <div className='bg-orange-800 divide-y-2'>
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
    return (
        <div className='bg-red-300  items-start flex flex-col min-h-[30em]  min-w-[30em] px-16 py-16'
            onDoubleClick={() => setCurrent((c: any) => (current.selectedID !== "" ? { ...c, selectedID: "", vf_id: "" } : c))}
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


