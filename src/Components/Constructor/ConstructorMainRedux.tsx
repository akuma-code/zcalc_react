import React, { useState, useEffect, useMemo } from 'react'
import { HookModelCTX, useHookContext } from '../../Context/HookModelCTX'
import { useToggle } from '../../hooks/useToggle'
import { ConstEncode, useUtils } from '../../hooks/useUtils'
import { FramesLib, FStore } from '../../Store/FrameStore'
import { DivProps } from '../../Types'
import { IFrameStoreItem } from '../../Types/FStoreTypes'
import { IGridRow } from '../../Types/ModelsTypes'
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
    rows: IGridRow[]
    frCode?: string
}
interface IHFramesSet {
    id?: string
    title?: string
    VFSets?: IViewFrame[] | []
}

export interface IViewFrame {
    id: string
    title?: string
    view: IFrame[] | []
    isActive?: boolean
}

const genID = useUtils.stringID
const init = () => ({
    id: genID(),
    rows: [{ row_id: genID(), cols: 1 }],
})
const initFullCnstr = {
    id: genID(),
    title: 'INIT CONSTRUCTION',
    VFSets: [FramePreset.ONE],

}
const newConstruct = {
    id: genID(),
    title: 'construct_#' + genID(),
    VFSets: [FramePreset.ONE]
}
const emptyConstruct = {
    id: "",
    title: "",
    VFSets: [] as IViewFrame[]

}
function FrameSetFactory(frames_set: IViewFrame, isSel?: boolean) {
    const { view } = frames_set

    //  (view.map((f) =>
    //     (<FramesSet {...f} key={f.id} className='hover:bg-[red] z-0 active:border-2 active:border-[red]' isSelected={isSel || false} />)))
}
const FullConstructView: React.FC<IHFramesSet> = (line_frames_set) => {
    const { setFullConstruction, current, setCurrent, FullConstruction } = useHookContext()
    const { title, VFSets } = line_frames_set
    const onClickFn = (fs_id: string) => {
        // selectFlag.Tgl()
        setCurrent && VFSets &&
            setCurrent((prev: any) => ({
                ...prev,
                id: fs_id,
                VFrames: VFSets.map(fs => fs.id === fs_id ? { view: [fs.view] } : fs),
                fs_id: fs_id
            }))

        console.log('current', current)
        // setFullConstruction && setFullConstruction(prev => fs_id !== current.id ? ({ ...prev, isActive: true }) : { ...prev, isActive: false })
    }

    return (
        <div>
            {title}
            <HStack>
                {
                    VFSets && VFSets.map((fs) =>
                        <VStack key={fs.id} className=''
                        >
                            {
                                fs.view.map((f) => (
                                    <FramesSet
                                        id={f.id}
                                        rows={f.rows}
                                        key={f.id}
                                        isSelected={f.id === current.id}
                                        onClickFn={() => onClickFn(f.id)}

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
    const [VFramesSet, setGridFrames] = useState<IFrame[] | []>([])
    const [current, setCurrent] = useState({ fs_id: "", VFrames: [] as IViewFrame[] })
    const [savedModels, saveModel] = useState([] as ISavedModel[])
    const [FullConstruction, setFullConstruction] = useState<IHFramesSet | {}>({} as IHFramesSet)


    const FrameRight = () => {
        // VFramesSet.length < 2 &&
        // setGridFrames((prev: typeof VFramesSet) => ([...prev, { id: genID(), rows: [{ row_id: genID(), cols: 1 }] }]))

        setFullConstruction((prev: any) => ({ ...prev, VFSets: [...prev.VFSets, FramePreset.NEW], id: genID() }))

    }

    const newFrame = () => {

        setFullConstruction(prev => ({ ...prev, VFSets: [FramePreset.NEW], id: genID() }))
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

    useEffect(() => {
        LoadLSFrames()
        return () => setGridFrames([])

    }, [])

    if (!FullConstruction) {
        console.log('ERROR');

        return (
            <HookModelCTX.Provider
                value={{
                    FullConstruction, setFullConstruction,
                    models: VFramesSet, setModels: setGridFrames,
                    current, setCurrent,
                    savedModels, saveModel
                }}
            >
                <div className='flex-col text-center m-1'>
                    NOTHING
                </div>
            </HookModelCTX.Provider>
        )
    }
    return (
        <HookModelCTX.Provider
            value={{
                FullConstruction, setFullConstruction,
                models: VFramesSet, setModels: setGridFrames,
                current, setCurrent,
                savedModels, saveModel
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
                            onClickFn={() => setGridFrames(savedModels)}
                            disabled={true}
                        >
                            Загрузить последнее
                        </Button>

                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={() => setFullConstruction(prev => ({ ...prev, ...emptyConstruct }))}
                        >Очистить конструктор
                        </button>


                    </div>
                    <div className='bg-orange-800 divide-y-2'>
                        <span className='text-2xl p-1 m-1'>
                            CanvasLayout
                        </span>
                        <Canvas>

                            {FullConstruction && <FullConstructView {...FullConstruction} />}
                        </Canvas>
                    </div>
                </div>
            </div>
        </HookModelCTX.Provider>
    )
}


const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='bg-red-300  items-start flex flex-col min-h-[30em]  min-w-[30em] px-16 py-2'>
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

        const res = frames_set.view.map((f) => (<FramesSet {...f} key={f.id} className='hover:bg-[red] z-10' isSelected={isSel || false} />))
        // const res = useMemo(() => frames_set.view.map((f) => (<FramesSet {...f} key={f.id} className='hover:bg-[red] z-10' isSelected={isSel} />)), [frames_set, isSel])
        return res

    }


}


