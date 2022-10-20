import React, { useState, HTMLAttributes, useContext } from 'react'
import { ConstructorContext } from '../../Context/ConstructCTX'
import { useUtils } from '../../hooks/useUtils'
import { IConstructGrid, IFrameConstruct, IWinFrame, IWinFramePart, IWinFrameRow } from '../../Types/FrameTypes'
import ConstructionFrame from './ConstructionFrame'
import { ConstructionGrid } from './ConstructionGrid'
import { WinFrame } from './Win_frame'

type ConstructorProps = {
    children?: React.ReactNode
} & HTMLAttributes<HTMLDivElement>




export const ConstructorMain: React.FC<ConstructorProps> = () => {

    const [frames, setFrames] = useState<IWinFrame[] | []>([])
    const [parts, setParts] = useState<IWinFramePart[] | []>([])
    const [grid, setGrid] = useState<[] | IConstructGrid[]>([])
    const [framesList, setFramesList] = useState<[] | IConstructGrid[]>([])
    const [rows, setRows] = useState<[] | IWinFrameRow[]>([])


    const AddFrame = () => {

        setFrames(prev => [...prev, initFrame])
    }


    return (
        <ConstructorContext.Provider value={{ frames, setFrames, grid, setGrid, framesList, setFramesList, parts, setParts, rows, setRows }}>

            <div className='flex-col text-center'>
                <b className="text-4xl">Конструктор</b>
                <div className='divide-x-4 columns-2 flex mt-3'>

                    <div className='bg-orange-800 flex flex-col divide-y px-2'>
                        <h3 className='text-2xl'>Control Panel</h3>
                        <button
                            onClick={() => AddFrame()}
                        >add Win Frame
                        </button>

                    </div>
                    <div className='bg-orange-800 divide-y-2'>
                        <span className='text-2xl p-1 m-1'>
                            CanvasLayout
                        </span>
                        <Canvas>
                            {frames.map((f, idx) => (
                                <WinFrame key={idx} wf_rows={f.wf_rows} />
                            ))}
                        </Canvas>
                    </div>
                </div>
            </div>
        </ConstructorContext.Provider>
    )
}



const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='bg-red-500 max-h-96 items-center flex flex-col min-h-[30em] max-w-[45em]'>

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

const genID = useUtils.generateID
const initROW = {
    id: 1,
    isActive: false,
    wf_parts: [{
        part_id: genID(),
        row_id: 1
    }]
}
const initFrame = {
    id: 1,
    wf_rows: [
        {
            id: 1,
            isActive: false,
            wf_parts: [{
                part_id: genID(),
                row_id: 1
            }]
        },

    ]
}

const test = {
    id: 1,
    wf_rows: [
        {
            id: 1,
            isActive: false,
            wf_parts: [{
                part_id: genID(),
                row_id: 1
            }]
        },
        {
            id: 2,
            isActive: false,
            wf_parts: [{
                part_id: genID(),
                row_id: 2
            },
            {
                part_id: genID(),
                row_id: 2
            }]
        }
    ]
}