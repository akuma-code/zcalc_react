import React, { useState, useEffect, useContext, HTMLAttributes, FC } from 'react'
import { ReducerCTX } from '../../Context/ReduceConstrucCTX'
import { useNodeList } from '../../hooks/useModelHooks'
import { WinFrameModel_3 } from '../../Models/WinFrameModel'
import Button from '../UI/Button'

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
]
type Props = {}

export const ConstructorMainRedux = (): JSX.Element => {
    const [models3, setModels3] = useState<WinFrameModel_3[] | []>([])


    useNodeList(yy)
    // console.log('unodes', nodes);

    return (
        <ReducerCTX.Provider
            value={{
                models3,
                setModels3
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
                        >Добавить раму
                        </button>
                        <Button bg='#11b434'
                        >
                            Сохранить
                        </Button>
                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                        >Очистить конструктор
                        </button>


                    </div>
                    <div className='bg-orange-800 divide-y-2'>
                        <span className='text-2xl p-1 m-1'>
                            CanvasLayout
                        </span>
                        <Canvas>

                        </Canvas>
                    </div>
                </div>
            </div>
        </ReducerCTX.Provider>
    )
}

const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='bg-red-500 max-h-96 items-center flex flex-col min-h-[30em]  min-w-[20em] px-4 py-2'>

            {children}
        </div>
    )
}