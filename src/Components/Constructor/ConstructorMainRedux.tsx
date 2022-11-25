import React, { useState, useEffect } from 'react'
import { HookModelCTX } from '../../Context/HookModelCTX'
import { ConstEncode, useUtils } from '../../hooks/useUtils'
import { FramesLib, FStore } from '../../Store/FrameStore'
import { IFrameStoreItem } from '../../Types/FStoreTypes'
import { IGridRow } from '../../Types/ModelsTypes'
import Button from '../UI/Button'
import GridConstruction, { IGridConstProps, IGridModel } from './GridConstruction'


type Props = IGridConstProps
interface ISavedModel {
    id: string
    grid: IGridRow[]
    frCode?: string
}
const genID = useUtils.stringID
const init = () => ({
    id: genID(),
    grid: [{ row_id: '1111', cols: 1 }],
})


export const ConstructorMainRedux = (): JSX.Element => {
    const [models, setModels] = useState<IGridModel[] | []>([])
    const [current, setCurrent] = useState({} as IGridModel)
    const [savedModels, saveModel] = useState([] as ISavedModel[])



    const AddFrame = () => {
        models.length < 2 &&
            setModels((prev: typeof models) => ([...prev, { id: genID(), grid: [{ row_id: genID(), cols: 1 }] }]))
    }

    const newFrame = () => {
        setModels([])
        setModels([init()])
    }
    const SAVE = (models: IGridModel[]) => {
        const code = ConstEncode(models)
        const prep = models.map(frame => ({ ...frame, frCode: code }))
        const store_item: IFrameStoreItem = {
            id: genID(),
            frameBox: prep,
            frameName: `frame#${genID()}`,
        }
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
            saveModel(prev => [...box])
        }
    }

    useEffect(() => {
        LoadLSFrames()
        return () => setModels([])

    }, [])

    return (
        <HookModelCTX.Provider
            value={{
                models, setModels,
                current, setCurrent,
                savedModels, saveModel
            }}
        >


            <div className='flex-col text-center'>
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
                            onClickFn={() => SAVE(models)}
                        >
                            Сохранить
                        </Button>
                        <Button bg='#2b2206'
                            onClickFn={() => setModels(savedModels)}
                        >
                            Загрузить последнее
                        </Button>

                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={() => setModels([])}
                        >Очистить конструктор
                        </button>


                    </div>
                    <div className='bg-orange-800 divide-y-2'>
                        <span className='text-2xl p-1 m-1'>
                            CanvasLayout
                        </span>
                        <Canvas>
                            <VertConWrapper>
                                {models && models.map((grid_model, idx) => (
                                    <GridConstruction
                                        key={grid_model.id}
                                        grid={grid_model.grid}
                                        id={grid_model.id}

                                    />
                                ))}
                            </VertConWrapper>

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
const VertConWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex flex-col-reverse'>
            {children}
        </div>
    )
}

const SaveToStore = (modelsConstruction: IGridModel[]) => {
    const newfsItem = (name?: string) => {
        const frName = name || prompt('Input Construction Name') || `frame#${genID()}`
        const item: IFrameStoreItem = {
            id: genID(),
            frameName: frName,
            frameBox: [...modelsConstruction]
        }
        return item
    }
    FStore.save([newfsItem()])
    return FStore
}
const fsi = {
    "id": "0de5",
    "frameName": "sss",
    "frameBox": [
        {
            "id": "3a37",
            "grid": [
                {
                    "row_id": "9c0c",
                    "cols": 4
                },
                {
                    "row_id": "86fe",
                    "cols": 2
                },
                {
                    "row_id": "ea45",
                    "cols": 3
                }
            ],
            "frCode": "423"
        }
    ]
}