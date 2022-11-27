import React, { HTMLAttributes, useState, useEffect, useMemo } from 'react'
import { CodePreviewCard } from './CodePreviewCard'

type FrameLibraryProps = {

} & HTMLAttributes<HTMLDivElement>
type DBProps = { children?: React.ReactNode }


export const DivBlock: React.FC<DBProps> = () => (
    <div className='min-w-[2em] min-h-[4em] bg-[#0f85ca] border-2 border-black' />
)


export const FramesLibrary: React.FC<FrameLibraryProps> = () => {

    const [codeInput, setCodeInput] = useState("")


    return (
        <div className='border-2 border-black p-2 m-2 container'>
            <h3 className='text-4xl text-bold text-center'>
                FramesLibrary
            </h3>
            <div className='flex-row border border-black flex items-center justify-between p-2'>
                <label className='m-1'>
                    <input type="text"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                    />
                </label>
                <button className='p-2 my-2 font-semibold rounded-md bg-blue-800 text-white active:bg-blue-50 active:text-black '

                >
                    Submit
                </button>
            </div>
            {
                codeInput &&
                <CodePreviewCard frameCode={codeInput} />
            }
        </div>
    )
}

class FlexBlock {
    row: typeof DivBlock[]
    constructor(count = 1) {
        this.row = this.blocks(count)
    }

    blocks(count: number) {
        const arr = [] as typeof DivBlock[]
        let cols = count
        while (cols > 0) {
            arr.push(DivBlock)
            cols--
        }
        return arr
    }
}
