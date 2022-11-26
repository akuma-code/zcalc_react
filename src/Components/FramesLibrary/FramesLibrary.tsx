import React, { HTMLAttributes, useState, useEffect } from 'react'

type FrameLibraryProps = {

} & HTMLAttributes<HTMLDivElement>

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
                codeInput && <PreviewCard frameCode={codeInput} />
            }
        </div>
    )
}

type PreviewCardProps = {
    frameCode: string
}
export const DecodeFrame = (code: string) => {
    const splitframes = code.split('-')
    const decoded = splitframes.map(fr => fr.split('').map((s) => ({ cols: parseInt(s) })))
    // console.log('decoded', decoded)
    return decoded
}


const PreviewCard: React.FC<PreviewCardProps> = ({ frameCode }) => {

    const [viewGrid, setViewGrid] = useState<{ cols: number }[][]>([])
    const [blocks, setBlocks] = useState<JSX.Element[][][]>([])
    const convertGrid = (grid: typeof viewGrid) => {

        const res = grid.map(frame => frame.map(line => {
            const row = []
            let len = line.cols
            while (len > 0) {
                row.push(DivBlock)
                len--
            }
            return row
        }))
        return res
    }
    useEffect(() => {
        setViewGrid(DecodeFrame(frameCode))
        console.log('viewGrid', viewGrid)

    }, [frameCode])
    useEffect(() => {
        setBlocks(convertGrid(viewGrid))
        console.log('blocks', blocks)
    }, [viewGrid])
    const row_classlist = (cols: number) => [`columns-${cols}`,
        'relative gap-x-4   bg-[#ffffff] p-3  hover:bg-slate-400 border-b-0 border-t-0']
        .join(' ')

    return (
        <div className='container flex-column bg-slate-500'>
            <div>PreviewCard, {frameCode}</div>
            <div className='m-2 p-4 bg-white border-black '>
                {
                    blocks && blocks.map((row, idx) => (
                        <DivRowWrapper key={idx}>
                            {row}
                        </DivRowWrapper>
                    ))
                }
            </div>
        </div>
    )
}

const DivBlock = <div
    className='min-w-[2em] min-h-[4em] bg-[#0f85ca] border-2 border-black'
/>
type DivRowWRProps = {
    children: React.ReactNode
}
const DivRowWrapper: React.FC<DivRowWRProps> = ({ children }) => {

    let cols = Array.isArray(children) ? children.length : 1

    const row_classlist = [`columns-${cols}`,
        'relative gap-x-6 max-w-[55em]  bg-[#ffffff] p-5  hover:bg-slate-400 border-b-0 border-t-0']
        .join(' ')
    return (
        <div className={row_classlist}>
            {children}
        </div>
    )
}

const fillBlocks = (grid: { cols: number }[][]) => {
    return grid.map(frame => frame.map(line => {
        const row = []
        let len = line.cols
        while (len > 0) {
            row.push(DivBlock)
            len--
        }
        return row
    }))
}