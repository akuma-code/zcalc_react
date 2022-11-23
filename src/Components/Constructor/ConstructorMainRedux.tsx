import React, { useState, useEffect, useContext, HTMLAttributes, FC } from 'react'
import { HookModelCTX } from '../../Context/HookModelCTX'
import { useNodeList } from '../../hooks/useModelHooks'
import { useUtils } from '../../hooks/useUtils'
import { CNode, ConstructionModel } from '../../Models/WinFrameHookModel'
import { WinFrameModel_3 } from '../../Models/WinFrameModel'
import { IHook_Model } from '../../Types/ModelsTypes'
import Button from '../UI/Button'
import GridConstruction, { ICell, ICellsList, IGridConstProps } from './GridConstruction'


type Props = IGridConstProps

export const ConstructorMainRedux = (): JSX.Element => {
    const [models, setModels] = useState<IGridConstProps[] | []>([])
    const [current, setCurrent] = useState({} as any)
    const [savedModels, saveModel] = useState([] as any)

    const initConst = (row_id: string) => ({
        id: useUtils.stringID(),
        grid: [{ row_id, cols: 1 }, { row_id: '123', cols: 2 }],
        nodes: [new CNode(row_id)]
    })
    const AddFrame = () => {
        const ID = useUtils.stringID()
        models.length < 2 && models.length > 0 && setModels((prev: any) => ([...prev, initConst(ID)]))
    }

    const newFrame = () => {
        const ID = useUtils.stringID()
        setModels([initConst(ID)])
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
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={newFrame}
                        >Новая рама
                        </button>
                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={AddFrame}
                        >Добавить раму
                        </button>

                        <Button bg='#11b434'
                            onClickFn={() => setCurrent(models[0])}
                        >
                            Сохранить
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
                            {models && models.map(grid_model => (
                                <GridConstruction
                                    grid={grid_model.grid}
                                    key={grid_model.id}
                                    nodes={grid_model.nodes}
                                    id={grid_model.id} />
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
        <div className='bg-red-500  items-center flex flex-col min-h-[30em]  min-w-[20em] px-16 py-2'>

            {children}
        </div>
    )
}

