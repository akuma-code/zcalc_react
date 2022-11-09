import React, { useState, useEffect, useContext, HTMLAttributes, FC } from 'react'
import { HookModelCTX } from '../../Context/HookModelCTX'
import { useNodeList } from '../../hooks/useModelHooks'
import { HookModel } from '../../Models/WinFrameHookModel'
import { WinFrameModel_3 } from '../../Models/WinFrameModel'
import { IHook_Model } from '../../Types/ModelsTypes'
import Button from '../UI/Button'
import HookModelElem from './HookModelElem'


type Props = {}

export const ConstructorMainRedux = (): JSX.Element => {
    const [models, setModels] = useState<IHook_Model[] | []>([])
    const [current, setCurrent] = useState({} as any)
    const [savedModels, saveModel] = useState([] as any)

    const CreateFrame = () => models.length < 2 && setModels(prev => ([...prev, new HookModel()]))
    const Select = () => {
        console.log('click');
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
                            onClick={CreateFrame}
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
                            {models && models.map(hook_model => (
                                <HookModelElem model={hook_model} key={hook_model.id} onClick={Select} />
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



const yy = [
    {
        id: '1',
        row_lvl: 0
    },
    {
        id: '2',
        row_lvl: 0
    },
    {
        id: '3',
        row_lvl: 1
    },
    {
        id: '4',
        row_lvl: 2
    },
]