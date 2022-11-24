import React, { useState } from 'react'
import { HookModelCTX } from '../../Context/HookModelCTX'
import { useUtils } from '../../hooks/useUtils'
import { IGridRow } from '../../Types/ModelsTypes'
import Button from '../UI/Button'
import GridConstruction, { IGridConstProps } from './GridConstruction'


type Props = IGridConstProps
interface ISavedModel {
    id: string
    grid: IGridRow[]
}
const genID = useUtils.stringID
export const ConstructorMainRedux = (): JSX.Element => {
    const [models, setModels] = useState<IGridConstProps[] | []>([])
    const [current, setCurrent] = useState({} as Props)
    const [savedModels, saveModel] = useState([] as ISavedModel[])

    const initFrame = (rowID: string) => ({
        id: genID(),
        grid: [{ row_id: rowID, cols: 1 }],
    })
    const AddFrame = () => {
        const frameID = genID()
        models.length > 0 && models.length < 2 &&
            setModels((prev: any) => ([...prev, { id: frameID, grid: [{ row_id: genID(), cols: 1 }], }]))
    }

    const newFrame = () => {
        const ID = useUtils.stringID()
        setModels([initFrame(ID)])
    }

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
                            onClickFn={() => saveModel(models)}
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
                            {models && models.map((grid_model, idx) => (
                                <GridConstruction
                                    grid={grid_model.grid}
                                    key={grid_model.id}
                                    id={grid_model.id}

                                />
                            ))}
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
