import React, { useState, useEffect } from 'react'
import { HookModelCTX } from '../../Context/HookModelCTX'
import { ConstEncode, useUtils } from '../../hooks/useUtils'
import { FramesLib, FStore } from '../../Store/FrameStore'
import { IFrameStoreItem } from '../../Types/FStoreTypes'
import { IGridRow } from '../../Types/ModelsTypes'
import Button from '../UI/Button'
import FramesSet, { IFrame } from './FramesSet'

const frame_preset_31 =
{
    "id": "d277123",
    "rows": [
        {
            "row_id": "3742341",
            "cols": 1
        },
        {
            "row_id": "5ad2345",
            "cols": 3
        }
    ],
    "frCode": "13"
}



const fr_set_31_1 = [
    {
        "id": "d277123",
        "rows": [
            {
                "row_id": "3742341",
                "cols": 1
            },
            {
                "row_id": "5ad2345",
                "cols": 3
            }
        ],
        "frCode": "13"
    } as IFrame,
    {
        "id": "d2771123",
        "rows": [
            {
                "row_id": "37341",
                "cols": 1
            },

        ],
        "frCode": "1"
    },
]


const FramePreset = {
    THREE_ONE: {
        "id": "9f234d9",
        "title": "31",
        "view": frame_preset_31
    },
    ONE_ONE: {
        "id": "58171",
        "title": "1-1",
        "view": [
            {
                "id": "0836a6",
                "rows": [
                    {
                        "row_id": "22606a",
                        "cols": 1
                    }
                ],
                "frCode": "1"
            },
            {
                "id": "0836a",
                "rows": [
                    {
                        "row_id": "2206a",
                        "cols": 1
                    }
                ],
                "frCode": "1"
            }
        ]
    },
    ONE: {
        "id": "5871",
        "title": "SINGLE",
        "view": [
            {
                "id": "0836a",
                "rows": [
                    {
                        "row_id": "2206a",
                        "cols": 1
                    }
                ],
                "frCode": "1"
            }
        ]
    },
    TWO: {
        "id": "58747",
        "view": [
            {
                "id": "0863a",
                "rows": [
                    {
                        "row_id": "2016a",
                        "cols": 2
                    }
                ],
                "frCode": "2"
            }
        ]
    },
    THREE: {
        "id": "9f2d9",
        "title": "THREE",
        "view": [
            {
                "id": "d2737",
                "rows": [
                    {
                        "row_id": "5a112d5",
                        "cols": 3
                    }
                ],
                "frCode": "3"
            }
        ]
    },

}
const frame_preset_2_31 = {
    "id": "9f2d9",
    "title": "2_31",
    "hstack": [
        FramePreset.TWO.view,
        FramePreset.THREE_ONE.view
    ],

}

const viewConstPreset = {
    "id": "000",
    "title": "view_preset",
    "VFSets": [FramePreset.ONE_ONE, FramePreset.TWO]
} as ILineFramesSet

interface ISavedModel {
    id: string
    rows: IGridRow[]
    frCode?: string
}
interface ILineFramesSet {
    id?: string
    title?: string
    VFSets?: IViewFrame[] | []
}

export interface IViewFrame {
    id?: string
    title?: string
    view: IFrame[] | []
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
    title: 'new construction_#' + genID(),
    VFSets: [FramePreset.ONE]

}
const emptyConstruct = {
    id: "",
    title: "",
    VFSets: [] as IViewFrame[]

}

const FullConstructView: React.FC<ILineFramesSet> = (line_frames_set) => {

    const { title, VFSets, id } = line_frames_set

    return (
        <div>
            {title}
            <HStack>
                {VFSets && VFSets.map(ViewFactory.VFramesSet)}
            </HStack>
        </div>

    )
}


export const ConstructorMainRedux = (): JSX.Element => {
    const [VFramesSet, setGridFrames] = useState<IFrame[] | []>([])
    const [current, setCurrent] = useState({} as IFrame)
    const [savedModels, saveModel] = useState([] as ISavedModel[])
    const [FullConstruction, setFullConstruction] = useState<ILineFramesSet | {}>({})


    const AddFrame = () => {
        VFramesSet.length < 2 &&
            setGridFrames((prev: typeof VFramesSet) => ([...prev, { id: genID(), rows: [{ row_id: genID(), cols: 1 }] }]))
    }

    const newFrame = () => {
        setGridFrames([])
        // setFullConstruction(prev => ({ ...prev, ...emptyConstruct }))
        setGridFrames([init()])
        setFullConstruction(prev => ({ ...prev, VFSets: [FramePreset.ONE] }))
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
                            onClick={AddFrame}
                        >Добавить раму
                        </button>

                        <Button bg='#11b434'
                            onClickFn={() => SAVE(VFramesSet)}
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
const VStack: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex flex-col-reverse'>
            {children}
        </div>
    )
}
const HStack: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='flex'>
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
    static VFramesSet(frames_set: IViewFrame) {
        return (
            <VStack>
                {frames_set.view.map((f) => (
                    <FramesSet {...f} key={f.id} />
                ))}
            </VStack>
        )
    }

    static HFramesStack(hor_set: ILineFramesSet) {
        return (
            <HStack>
                {hor_set.VFSets && hor_set.VFSets.map(this.VFramesSet)}
            </HStack>
        )
    }
}
