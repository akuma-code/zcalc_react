/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect } from 'react'
import { useConstructCtx } from '../../Context/ConstructCTX'
import { useHookContext } from '../../Context/HookModelCTX'
import { useGridControl } from '../../hooks/useColsControl'
import { useUtils } from '../../hooks/useUtils'
import { ConstructionModel } from '../../Models/WinFrameHookModel'
import { DivProps } from '../../Types'
import { IGridRow } from '../../Types/ModelsTypes'
import { IcMinus, IcPlus, IcRowDown, IcRowUp, IcTrash } from '../Icons/IconsPack'

type IRowID = { row_id: string, id?: string }
export type IGridConstProps = Pick<ConstructionModel, 'rows'> & { id: string, frCode?: string }
export interface IFrame {
    id: string,
    frCode?: string
    rows: { row_id: string, cols: number }[],
}
export type IVFrameProps = {
    id: string
    isSelected?: boolean
    onClickFn?: (fs_id: string) => void
} & IFrame & DivProps

// export type INodeCols = { id: string, row_id: string }
interface VMRChildrenProps extends DivProps {
    children: React.ReactNode[]
}
type VMRowProps = {
    fs_id: string,
    cols: number,
    row_id: string,
    isFram: boolean
    addNode: (row_id: string) => void,
    remNode: (row_id: string) => void,
    isSelected?: boolean
}

interface FNodeProps extends IRowID {
    isFram: boolean
}

const genID = useUtils.stringID


//*****************!   GRID_CONSTRUCTION = FramesSet    *********/


const FramesSet = ({ rows, id, onClickFn, isSelected }: IVFrameProps) => {
    const [FRAME, FrameControl] = useGridControl(rows)
    const { models, setModels, setFullConstruction, current } = useHookContext()
    // const [construct, setConstruct] = useState<typeof currentConstruction | {}>({})

    // const currentConstruction = () => ({
    //     id, rows: FRAME
    // })

    const InitFrameRow = (row: IGridRow, idx: number, fs_id: string) => (
        <VMRow {...row}
            fs_id={fs_id}
            isSelected={isSelected}
            addNode={FrameControl.add}
            remNode={FrameControl.rem}
            isFram={(idx === 0 && FRAME.length === 2)}
        />
    )
    const remFrame = (frameID: string) => setModels(prev => prev.filter(m => m.id !== frameID))


    useEffect(() => {
        // const model = currentConstruction()
        // setConstruct({ id, grid: FRAME })
        // setFullConstruction && setFullConstruction(prev => ({ ...prev, view: models }))
        setModels(prev => prev.map(m => m.id === id ? { ...m, id, rows: FRAME } : m))
    }, [FRAME])

    const select = (id: string) => {
        onClickFn && onClickFn(id)
    }


    // const VMRowsMemed = useMemo(() => FRAME.map((f, idx) => InitFrameRow(f, idx, id)), [FRAME, isSelected])
    const VMRowsMemed = useMemo(() => FRAME.map((f, idx) => (
        <VMRow {...f}
            key={f.id}
            fs_id={f.id || ""}
            isSelected={isSelected}
            addNode={FrameControl.add}
            remNode={FrameControl.rem}
            isFram={(idx === 0 && FRAME.length === 2)}
        />
    )), [FRAME, isSelected])
    const isLastRow = VMRowsMemed.length === 1
    const isLastCol = current.lastCol
    const bgColor = isLastCol || isLastRow ? "bg-transparent" : "bg-green-400"
    return (
        <div className='relative border-2 border-[#000000] '
            onClick={() => select(id)}
        >
            {
                isSelected && <div className={`absolute 
                top-1 flex flex-col z-20 right-0
                p-1 max-w-[4em]`}>

                    <button className='top-1 border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black]'
                        onClick={() => FrameControl.rowUp()}
                    >
                        <IcRowUp w={6} h={6} />
                    </button>
                    <button className='top-8 border-2 bg-[#df1111] p-1 m-1 rounded-md border-[black]'
                        onClick={() => remFrame(id)}
                    >
                        <IcTrash hw={6} />
                    </button>


                    <button className='top-14 border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black]'
                        onClick={() => FrameControl.rowDown()}
                    >
                        <IcRowDown hw={6} />
                    </button>
                </div>
            }
            {
                VMRowsMemed
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
    const { isSelected } = props
    const StraightNodesMemed = useMemo(() => setStraightNodes(props.cols, props.row_id), [props])
    const isLastCol = StraightNodesMemed.length === 1
    const { setCurrent, current } = useHookContext()
    useEffect(() => {
        setCurrent && setCurrent((prev: any) => ({ ...prev, isLastCol: isLastCol }))
        isLastCol && console.log(isLastCol, "lastcol");


    }, [isLastCol])

    return (
        <div className="relative">


            <VMRowFrameWrapper >
                {StraightNodesMemed.map(item => (<FNode {...item} key={item.id} isFram={props.isFram} />))}
            </VMRowFrameWrapper>

            {isSelected &&
                <div className={`absolute p-1   
                 z-10  bottom-1 flex flex-col`}  >


                    <button className='bg-[#931dca]  p-1 m-1 rounded-md border-[#8a8a8a]'
                        onClick={() => props.addNode(props.row_id)}
                    >
                        <IcPlus hw={6} />
                    </button>
                    <button className='bg-[#931dca] p-1  m-1 rounded-md border-[#8a8a8a]'
                        onClick={() => props.remNode(props.row_id)}
                    >
                        <IcMinus hw={6} />
                    </button>
                </div>}

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

