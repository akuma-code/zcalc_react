import React, { useEffect, useState } from 'react'
import { BaseFrame } from '../Frames/BaseFrame'


type HomePageProps = {
    children?: React.ReactNode
}

const frame_f1 = <div className="flex h-[10em] min-w-[5em] border-4 border-double bg-[#3ddd07]"></div>
const frame_f = <div className="flex h-[8em]  border-4 border-double bg-[#1a5c04]"></div>



export const Homepage: React.FC<HomePageProps> = () => {
    const [cols, setCols] = useState(1)
    const [rows, setRows] = useState(1)
    const [frames, setFrames] = useState<JSX.Element[]>([])

    const add = (frame: JSX.Element) => setFrames([...frames, frame])
    const getCols = () => `gap-x-6 columns-${cols} bg-[#2e2e2e] p-5`

    useEffect(() => {
        setCols(frames.length)

        return () => {

        }
    }, [frames])

    return (
        <div className='container  flex m-1 bg-[#7a7a7a]'>
            <button className='m-1  border-4'
                onClick={() => add(frame_f)}
            >ADD</button>
            <div className="flex  bg-orange-400 flex-col-reverse w-fit">
                <div className="gap-x-6  columns-3   bg-[#2e2e2e]  p-5">
                    {frame_f1}
                    {frame_f1}
                    {frame_f1}


                </div>
                <div className={getCols()}>
                    {frames.map(f => f)}
                </div>

            </div>
        </div>
    )
}
