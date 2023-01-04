import React, { useState, useEffect } from 'react'
import { HookModelCTX } from '../../Context/HookModelCTX'
import { ConstEncode, useUtils } from '../../hooks/useUtils'
import { FramesLib, FStore } from '../../Store/FrameStore'
import { IFrameStoreItem } from '../../Types/FStoreTypes'
import { IGridRow } from '../../Types/ModelsTypes'
import Button from '../UI/Button'
import FramesSet, { IGridConstProps, IGridFrame } from './FramesSet'


interface ISavedModel {
    id: string
    rows: IGridRow[]
    frCode?: string
}
interface IFullConstr {
    id: string
    title?: string
    VFSets: IGridFrame[]
}
const genID = useUtils.stringID
const init = () => ({
    id: genID(),
    rows: [{ row_id: '1111', cols: 1 }],
})


export const ConstructorMainRedux = (): JSX.Element => {
    const [gridFrames, setGridFrames] = useState<IGridFrame[] | []>([])
    const [current, setCurrent] = useState({} as IGridFrame)
    const [savedModels, saveModel] = useState([] as ISavedModel[])
    const [FullConstruction, setFullConstruction] = useState<IFullConstr | {}>({})


    const AddFrame = () => {
        gridFrames.length < 2 &&
            setGridFrames((prev: typeof gridFrames) => ([...prev, { id: genID(), rows: [{ row_id: genID(), cols: 1 }] }]))
    }

    const newFrame = () => {
        setGridFrames([])
        setGridFrames([init()])
    }
    const SAVE = (models: IGridFrame[]) => {
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

    // const CreateFramesSet = (grid_model: IGridModel, idx: number): JSX.Element => (

    //     <FramesSet
    //         key={idx}
    //         grid={grid_model.grid}
    //         id={grid_model.id} />

    // )
    return (
        <HookModelCTX.Provider
            value={{
                FullConstruction, setFullConstruction,
                models: gridFrames, setModels: setGridFrames,
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
                            onClick={AddFrame}
                        >Добавить раму
                        </button>

                        <Button bg='#11b434'
                            onClickFn={() => SAVE(gridFrames)}
                        >
                            Сохранить
                        </Button>
                        <Button bg='#2b2206'
                            onClickFn={() => setGridFrames(savedModels)}
                        >
                            Загрузить последнее
                        </Button>

                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={() => setGridFrames([])}
                        >Очистить конструктор
                        </button>


                    </div>
                    <div className='bg-orange-800 divide-y-2'>
                        <span className='text-2xl p-1 m-1'>
                            CanvasLayout
                        </span>
                        <Canvas>
                            <div>

                            </div>
                            <VertConWrapper>
                                {gridFrames && gridFrames.map(CreateFramesSet)}
                            </VertConWrapper>

                        </Canvas>
                    </div>
                </div>
            </div>
        </HookModelCTX.Provider>
    )
}
const CreateFramesSet = (grid_model: IGridFrame, idx: number): JSX.Element => (

    <FramesSet
        key={idx}
        rows={grid_model.rows}
        id={grid_model.id} />

)


const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='bg-red-300  items-start flex flex-col min-h-[30em]  min-w-[30em] px-16 py-2'>
            {children}
        </div>
    )
}
const VertConWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex flex-col-reverse'>
            {children}
        </div>
    )
}

let count = 0
const SaveToStore = (modelsConstruction: IGridFrame[]) => {
    const newfsItem = (name?: string) => {
        const frName = name || prompt('Input Construction Name') || 'NONAME_' + count || `frame#${genID()}`
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
