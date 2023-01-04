/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, HTMLAttributes, useEffect } from 'react'
import { useHookContext } from '../../Context/HookModelCTX'
import { useGridControl } from '../../hooks/useColsControl'
import { useUtils } from '../../hooks/useUtils'
import { ConstructionModel } from '../../Models/WinFrameHookModel'
import { FStore } from '../../Store/FrameStore'
import { IGridRow } from '../../Types/ModelsTypes'
import { IcMinus, IcPlus, IcRowDown, IcRowUp, IcTrash } from '../Icons/IconsPack'

type IRowID = { row_id: string, id?: string }
export type IGridConstProps = Pick<ConstructionModel, 'grid'> & { id: string, frCode?: string }
export interface IGridModel {
    id: string,
    grid: { row_id: string, cols: number }[],
    frCode?: string
}
export interface IGridConstructorProps extends IGridModel {

}
export type INodeCols = { id: string, row_id: string }
interface VMRChildrenProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode[]
}
type VMRowProps = {
    cols: number,
    row_id: string,
    isFram: boolean
    addNode: (row_id: string) => void,
    remNode: (row_id: string) => void,
}

interface FNodeProps extends IRowID {
    isFram: boolean
}

const genID = useUtils.stringID


//* GRID_CONSTRUCTION*/
const FramesSet = ({ grid, id }: IGridConstructorProps) => {
    const [FRAME, FrameControl] = useGridControl(grid)
    const { setModels } = useHookContext()
    const [construct, setConstruct] = useState<typeof currentConstruction | {}>({})

    const currentConstruction = () => ({
        id, grid: FRAME
    })
    const InitFrameRow = (row: IGridRow, idx: number) => (
        <VMRow {...row}
            addNode={FrameControl.add}
            remNode={FrameControl.rem}
            isFram={(idx === 0 && FRAME.length === 2)}
        />
    )
    const remFrame = (frameID: string) => setModels(prev => prev.filter(m => m.id !== frameID))
    useEffect(() => {
        // const model = currentConstruction()
        // setConstruct({ id, grid: FRAME })
        setModels(prev => prev.map(m => m.id === id ? { ...m, id, grid: FRAME } : m))
    }, [FRAME])

    const VMRowMemed = useMemo(() => FRAME.map(InitFrameRow), [FRAME])

    return (
        <div className='relative border-2 border-[#000000]' >
            <button className='absolute left-[-3em] top-1 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => FrameControl.rowUp()}
            >
                <IcRowUp w={6} h={6} />
            </button>
            <button className='absolute left-[-3em] top-[7em] border-2 bg-[#df1111] p-1 mt-1 rounded-md border-[black]'
                onClick={() => remFrame(id)}
            >
                <IcTrash hw={6} />
            </button>


            <button className='absolute left-[-3em] top-14 border-2 bg-[#2165f8] p-1 mt-1 rounded-md border-[black]'
                onClick={() => FrameControl.rowDown()}
            >
                <IcRowDown hw={6} />
            </button>

            {
                VMRowMemed
            }
        </div>
    )
}


const VMRowFrameWrapper: React.FC<VMRChildrenProps> = ({ children }) => {
    let cols = children.length

    const row_classlist = [`columns-${cols}`,
        `
        relative 
        gap-x-6
        max-w-[55em]
        bg-[#ffffff] 
        p-5 
        hover:bg-slate-400
        border-t-0
        border-b-0 
        `].join(' ')
    return (
        <div className={row_classlist}>
            {children}
        </div>
    )
}

const VMRow: React.FC<VMRowProps> = (props) => {

    const StraightNodesMemed = useMemo(() => setStraightNodes(props.cols, props.row_id), [props])


    return (
        <div className="relative">


            <VMRowFrameWrapper >
                {StraightNodesMemed.map(item => (<FNode {...item} key={item.id} isFram={props.isFram} />))}
            </VMRowFrameWrapper>


            <button className='absolute left-[.5em] bottom-1 border-2 bg-[#931dca] p-1 mt-1 rounded-md border-[#8a8a8a]'
                onClick={() => props.addNode(props.row_id)}
            >
                <IcPlus hw={6} />
            </button>
            <button className='absolute left-[3.5em] bottom-1 border-2 bg-[#931dca] p-1 mt-1 rounded-md border-[#8a8a8a]'
                onClick={() => props.remNode(props.row_id)}
            >
                <IcMinus hw={6} />
            </button>

        </div>
    )
}

const FNode: React.FC<FNodeProps> = (item) => {

    return <div className={`flex-col  min-w-[5em] border-8 border-double border-black bg-[#0f66ad] justify-items-start 
        h-[${item.isFram ? `4em` : `10em`}]`}
    >

        {
            <div className='text-white  mt-2 text-[.8rem] flex-col'>
                {item.row_id && item.row_id}
            </div>
        }

    </div>
}
const setStraightNodes = (n: number, id?: string) => {
    const line = [] as IRowID[]
    const rid = id || genID()
    while (n > 0) {
        line.push({ id: genID(), row_id: rid })
        n--
    }
    return line
}
export default FramesSet

