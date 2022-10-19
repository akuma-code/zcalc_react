import React, { useState, HTMLAttributes, useContext } from 'react'
import { ConstructorContext } from '../../Context/ConstructCTX'
import { IConstructGrid, IFrameConstruct } from '../../Types/FrameTypes'
import ConstructionFrame from './ConstructionFrame'
import { ConstructionGrid } from './ConstructionGrid'

type ConstructorProps = {
    children?: React.ReactNode
}



export const ConstructorMain: React.FC<ConstructorProps> = () => {

    const [frames, setFrames] = useState<IFrameConstruct[] | []>([])
    const [grid, setGrid] = useState<[] | IConstructGrid[]>([])
    const [constructList, setConstructList] = useState<[] | typeof grid>([])

    const addConstruction = (r: number = 1) => setGrid(prev => prev.map(g => g.row === r ? { ...g, cols: g.cols + 1 } : { ...g, row: r, cols: g.cols + 1 }
    ))


    return (
        <ConstructorContext.Provider value={{ frames, setFrames, grid, setGrid, constructList, setConstructList }}>

            <div className='flex-col text-center'>
                <b className="text-4xl">Конструктор</b>
                <div className='divide-x-4 columns-2 flex mt-3'>

                    <div className='bg-orange-400 flex flex-col divide-y'>
                        <h3 className='text-2xl'>Control Panel</h3>
                        <button
                            onClick={() => addConstruction()}
                        >add frame</button>
                    </div>
                    <Canvas>
                        {initFrames.map((gridrama, idx) =>
                            <ConstructionGrid key={idx} />)}
                    </Canvas>
                </div>
            </div>
        </ConstructorContext.Provider>
    )
}



const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='bg-red-500 max-h-96 items-center flex flex-col min-h-[30em]'>
            <span className='text-2xl'>
                CanvasLayout
            </span>
            {children}
        </div>
    )
}


const initFrames = [
    { row: 1, posNumb: 1 },
    { row: 1, posNumb: 2 },
    { row: 1, posNumb: 3 },
    { row: 2, posNumb: 4 },
    { row: 2, posNumb: 5 },
]