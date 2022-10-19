import React, { useState, HTMLAttributes, useContext } from 'react'
import { ConstructorContext } from '../../Context/ConstructCTX'
import { IConstructGrid, IFrameConstruct } from '../../Types/FrameTypes'
import ConstructionFrame from './ConstructionFrame'
import { ConstructionGrid } from './ConstructionGrid'
import { WinFrame } from './Win_frame'

type ConstructorProps = {
    children?: React.ReactNode
} & HTMLAttributes<HTMLDivElement>




export const ConstructorMain: React.FC<ConstructorProps> = () => {

    const [frames, setFrames] = useState<IFrameConstruct[] | []>([])
    const [grid, setGrid] = useState<[] | IConstructGrid[]>([])
    const [constructList, setConstructList] = useState<[] | typeof grid>([])



    return (
        <ConstructorContext.Provider value={{ frames, setFrames, grid, setGrid, constructList, setConstructList }}>

            <div className='flex-col text-center'>
                <b className="text-4xl">Конструктор</b>
                <div className='divide-x-4 columns-2 flex mt-3'>

                    <div className='bg-orange-400 flex flex-col divide-y'>
                        <h3 className='text-2xl'>Control Panel</h3>
                        <button onClick={() => {
                        }}
                        >add Win Frame
                        </button>
                        <button>Add row </button>
                    </div>
                    <Canvas>
                        <WinFrame wf_rows={initWFFrames} />
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
const initWFFrames = [
    {
        row_id: 1,
        isActive: true,
        wf_parts: [{ part_id: 10 }, { part_id: 20 }]
    },

    {
        row_id: 2,
        isActive: true,
        wf_parts: [{ part_id: 16 }, { part_id: 12 }]
    },

]