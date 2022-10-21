import React from 'react'
import { useConstructCtx } from '../../Context/ConstructCTX'

interface CtGridProps {
    grid?: {
        row?: number
        cols?: number
    }[]
}
const cls_rama = 'flex flex-col-reverse w-fit'
const cls_frame = `flex h-[10em] min-w-[5em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]`
const cls_frameTop = `flex h-[5em] min-w-[5em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]`

const H_Frame = (pN?: number) => <div className={cls_frame}>{pN || "###"}</div>

export const ConstructionGrid: React.FC<CtGridProps> = () => {
    const { grid = [], frames } = useConstructCtx()
    // const isFramTop = grid.length === 2
    const fillFrames = (numb: number) => {
        const arr = [] as any
        return arr.fill(H_Frame(), 1, numb)
    }
    const getFramesCount = grid.reduce((sum, current) => sum + current.cols, 0)
    const getPosNumbers = () => frames.map((f, idx) => ({ ...f, posNumb: idx + 1 }))

    getPosNumbers()

    console.log('grid', grid)


    return (
        <div className={cls_rama}>

        </div>
    )
}

// сначала grid => frames
const row = <div className={`gap-x-6 columns-${1} bg-[#2e2e2e] p-5 border-2 border-[#fff] hover:border-[red] hover:border-2`}  ></div>