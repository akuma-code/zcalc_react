/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHookContext } from '../../Context/HookModelCTX'
import { useGridControl } from '../../hooks/useColsControl'
import { useUtils } from '../../hooks/useUtils'
import { DataFrame, DataRow, DataVFrameSet, DataNode } from '../../Models/DataModel'
import { ConstructionModel } from '../../Models/WinFrameHookModel'
import { DivProps, RFC } from '../../Types'
import { IFrameNode, IFrameRow } from '../../Types/ModelsTypes'
import { IcChange, IcFrameRight, IcFrameUp, IcMinus, IcPlus, IcRowDown, IcRowUp, IcTrash } from '../Icons/IconsPack'
import { RRN } from '../../Types'


export type IGridConstProps = Pick<ConstructionModel, 'rows'> & { id: string, frCode?: string }
type IFrameType = 'door' | 'win'

export interface IFrame {
    id: string,
    frCode?: string
    rows: { row_id: string, col: number }[],
    data?: DataFrame
    props?: {
        id: string,
        frCode?: string
    }
}
export type IVFrameProps = {
    id: string
    isSelected?: boolean
    props?: {
        id: string
        isSelected?: boolean
    }
    data?: {
        frames: DataVFrameSet
    }
    onClickFn?: (fs_id: string) => void
} & IFrame & DivProps
export interface IHFramesSet {
    VFSets: IVFrameSet[]
    id: string
    title?: string
}

export interface IVFrameSet {
    id: string
    frames: IFrame[]
    title?: string
    isSelected?: boolean
    props?: {
        id: string
        frames: IFrame[]
        title?: string
        isSelected?: boolean
    }
    data?: DataVFrameSet

}
export type ViewModelActions = {
    DeleteViewFrame: (frameset_id: string) => void
    AddViewFrameRight: () => void
    AddViewFrameTop: (frameset_id: string) => void
    RemLastViewFrameTop: (frameset_id: string) => void
    RemLastViewFrame: () => void
    CreateViewFrame: () => void
    ClearFrames: () => void
    RemFrame: (frameset_id: string) => (frame_id: string) => void
    syncFrames: (frame_id: string, newframes: IFrameRow[]) => void
    setHFrameStack: React.Dispatch<React.SetStateAction<IHFramesSet>>
    changeCols: (vfs_id: string, f_id: string) => {
        UP: (row_id: string) => void
        Down: (row_id: string) => void
    }
}
// export type INodeCols = { id: string, row_id: string }

type VMRowProps = {
    data: DataRow
    props: {
        isSelected?: boolean
        isOnEdit?: boolean
        fs_id: string,
        isFram: boolean,
        frameType: IFrameType
    }

    addNode: (row_id: string) => void,
    remNode: (row_id: string) => void,
    rowUp: () => void,
    rowDown: (row_id?: string) => void
}
type FramesStackProps = {
    isSelected?: boolean
    data?: DataVFrameSet
    align?: 'top' | 'bot' | 'mid'
    justify?: 'left' | 'right' | 'mid'
} & DivProps
interface FNodeProps {
    data?: DataNode
    props?: {
        isFram: boolean
        row_id: string
        frameType?: 'door' | 'win'
        children?: React.ReactNode
    }
    isFram: boolean
    row_id: string
    frameType?: 'door' | 'win'
    children?: React.ReactNode
}

const _ID = useUtils.stringID


export const ConstructionView: React.FC<IHFramesSet> = (VModel) => {
    const { editInfo: current, setInfo: setCurrent, setVM } = useHookContext()
    const { VFSets } = VModel || []
    const selectFrame = (fs_id: string, f_id: string) => {

        return setCurrent && setCurrent((prev: any) => ({
            ...prev,
            selectedFrame: f_id,
            selectedFrameSet: fs_id,
            isEditing: true,
        }))
    }

    const ViewModelMemed = useMemo(() =>
        VFSets?.map((fs) =>
            <VStack key={fs.id} >
                {
                    fs.frames.map((f) => (
                        <ViewFrame
                            id={f.id}
                            rows={f.rows}
                            key={f.id}
                            isSelected={f.id === current.selectedFrame}
                            onClickFn={() => selectFrame(fs.id, f.id)}
                            data={{ frames: new DataFrame(f.rows, f.id), id: f.id, rows: f.rows }}
                        />
                    ))
                }
            </VStack>

        ), [VFSets, selectFrame])




    if (!VFSets || VFSets.length === 0) return (<div>
        <h2>Конструктор пуст!</h2>
    </div>)


    return (
        <HStack align='top'>
            {
                ViewModelMemed
            }
        </HStack>
    )
}
const VStack: React.FC<FramesStackProps> = ({ children, className, data }) => {
    const cls = 'flex flex-col-reverse border-collapse ' + className
    return (
        <div className={cls}>
            {children}
        </div>
    )
}
const HStack: React.FC<FramesStackProps> = ({ children, className, align = 'top' }) => {
    const frameAlign = {
        top: "items-start",
        mid: "items-center",
        bot: "items-end",
    } as const
    const cls = (classes?: string) => `flex devide-x-8  ${classes} ${frameAlign[align]}`

    return (
        <div className={cls(className)}>
            {children}
        </div>
    )
}


//*****************!   Vertical FramesStack    *********/


const ViewFrame = (props: IVFrameProps) => {
    const { rows, id: fs_id, onClickFn, isSelected, data } = props

    const [FRAME, FrameControl] = useGridControl(rows)
    const { editInfo: current, setVM, setInfo: setCurrent } = useHookContext()
    const DelSelFrame = setVM.RemFrame(current.selectedFrameSet)
    const [ft, setFt] = useState<IFrameType>('win')
    const setCols = setVM.changeCols(current.selectedFrame, fs_id)

    const select = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        onClickFn && onClickFn(id)

        if (e.ctrlKey) return setCurrent((c: typeof current) => (current.isEditing ? {
            ...c,
            selectedFrame: "",
            selectedFrameSet: "",
            isEditing: false
        }
            : c))
    }

    useEffect(() => {
        setVM.syncFrames(fs_id, FRAME)

    }, [FRAME, ft])


    const VStackControlButtons = useMemo(() => (
        <div className={`top-2  flex justify-around z-22 border-t-2 border-b-2 border-black`}>
            <button className='border-2 bg-[#078747] p-1 m-1 rounded-md border-[black]'
                onClick={() => setVM.AddViewFrameTop(current.selectedFrameSet)}
            >
                <IcFrameUp hw={8} />
            </button>
            <button className='top-1 border-2 bg-[#df1111] p-1 m-1 rounded-md border-[black]'
                onClick={() => DelSelFrame(current.selectedFrame)}
            >
                <IcTrash hw={6} />
            </button>
            <button className='border-2 bg-[#078747] p-1 m-1 rounded-md border-[black]'
                onClick={() => setVM.AddViewFrameRight()}

            >
                <IcFrameRight hw={8} />
            </button>


        </div>

    ), [current.selectedFrame, current.selectedFrameSet])

    const RowButtonStack = useMemo(() =>
        <div className={`absolute top-2 right-0 flex flex-col z-20 p-1 max-w-[4em] `} >
            <button className='border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black] ring-2 ring-slate-900 ring-offset-2'
                onClick={() => FrameControl.rowUp()}
            >
                <IcRowUp hw={5} />
            </button>
            {FRAME.length > 1 &&
                <button className='border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black] ring-2 ring-slate-900 ring-offset-2'
                    onClick={() => FrameControl.rowDown()}
                >
                    <IcRowDown hw={5} />
                </button>}
        </div>,
        [FRAME])


    const FrameControlButtons = useMemo(() =>
        <div className={`absolute bottom-16 right-1 flex flex-col z-20 p-1 max-w-[4em] `} >
            <button className='bg-amber-800 rounded-md p-1 ring-2 ring-slate-900 ring-offset-2'
                onClick={() => setFt(prev => prev === 'door' ? 'win' : 'door')}>
                <IcChange hw={6} />

            </button>
        </div>
        , [ft])

    // const NodeControlButtonStack = useCallback( (cols: number, row_id: string,) =>
    //     <div className={`absolute p-1 z-22  bottom-1 flex flex-col`}  >
    //         {cols > 1 &&
    //             <button className='bg-[#08629e] p-1  m-1 rounded-md border-[#8a8a8a] ring-2 ring-red-700 ring-offset-1'
    //                 onClick={() => FrameControl.rem(row_id)}
    //             >
    //                 <IcMinus hw={6} />
    //             </button>
    //         }

    //         <button className='bg-[#08629e] p-1  m-1 rounded-md border-[#8a8a8a] ring-2 ring-red-700 ring-offset-1'
    //             onClick={() => FrameControl.add(row_id)}
    //         >
    //             <IcPlus hw={6} />
    //         </button>


    //     </div>
    //     , [FRAME])

    const row_classlist = (cols: number) => [`columns-${cols}`, `gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-t-0 border-b-0 `].join(' ')




    const fram_cond = (idx: number) => idx === 0 && FRAME.length === 2
    const ROWSS = useCallback((f: IFrameRow, idx: number) =>
        <VMRow
            data={new DataRow(f.col, f.row_id)}
            props={{ fs_id, isSelected, isOnEdit: current.isEditing, frameType: ft, isFram: fram_cond(idx) }}
            addNode={FrameControl.add}
            remNode={FrameControl.rem}
            rowUp={FrameControl.rowUp}
            rowDown={FrameControl.rowDown}
            key={f.row_id}
        />, [ft, fs_id, FrameControl,])


    // const NODES = useCallback(({ id: string, row_id: string, isFram: boolean, frameType: IFrameType, col: number }) => RF.genNodes(row_id, isFram, frameType)(col), [FRAME])
    // const NodesRow = useCallback((NODES: { row_id: string, isFram: boolean, frameType: IFrameType, col: number, id: string }[]) => {
    //     return RF.List({
    //         items: NODES,
    //         renderItem: (nodeData) => <FNode {...nodeData} key={nodeData.id} />
    //     })
    // }, [props])



    const RowComponent = useCallback((f: IFrameRow, idx: number) => {
        const Props = {
            id: f.row_id,
            row_id: f.row_id,
            isFram: false,
            frameType: 'win'
        }

        return <div className={` ${isSelected || current.isEditing ? 'opacity-100' : '  opacity-50'} relative`}        >
            <div className={row_classlist(f.col)}>

            </div>
        </div>
    }, [])


    return (

        <div className='relative border border-[#000] flex flex-col bg-slate-700'
            onClick={(e) => select(e, fs_id)}
        >
            {
                FRAME.map(ROWSS)
            }
            {

            }
            {/* {isSelected && NodeControlButtonStack} */}
            {isSelected && VStackControlButtons}
            {isSelected && RowButtonStack}
            {isSelected && FrameControlButtons}
            {
                // isSelected &&
                // <button onClick={() => setFtype('door')}>
                //     TYPE
                // </button>
            }

        </div>

    )
}




//! NodesRow  *************************


const VMRow: React.FC<VMRowProps> = (FC_Props) => {
    const { props: { isSelected, isOnEdit, isFram, frameType }, data } = FC_Props

    // const ViewRow = setStraightNodes(props.cols, props.row_id)
    // const NODES = useMemo(() => RF.NodesArray(props.row_id, props.cols, props.isFram, props.frameType = 'win'),
    //     [props.row_id, props.cols, props.isFram, props.frameType])
    // const Elems = useMemo(
    //     () => RF.Elems(props.row_id, props.cols, props.isFram, frameType),
    //     [props.row_id, props.cols, props.isFram, frameType]
    // )

    const NODES = RF.genNodes(data.row_id, isFram, frameType)
    const NodesRow = useMemo(() => {
        return RF.List({
            items: NODES(data.col),
            renderItem: (nodeData) => <FNode {...nodeData} frameType={frameType} key={nodeData.id} />
        })
    }, [data.col, isFram, frameType])

    const NodeControlButtonStack = useMemo(() =>
        <div className={`absolute p-1 z-22  bottom-1 flex flex-col`}  >
            {data!.col > 1 &&
                <button className='bg-[#08629e] p-1  m-1 rounded-md border-[#8a8a8a] ring-2 ring-red-700 ring-offset-1'
                    onClick={() => FC_Props.remNode(data!.row_id)}
                >
                    <IcMinus hw={6} />
                </button>
            }

            <button className='bg-[#08629e] p-1  m-1 rounded-md border-[#8a8a8a] ring-2 ring-red-700 ring-offset-1'
                onClick={() => FC_Props.addNode(data!.row_id)}
            >
                <IcPlus hw={6} />
            </button>


        </div>
        , [data.row_id, data.col])

    const row_classlist = [`columns-${data.col}`, `gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-t-0 border-b-0 `].join(' ')



    return (
        <div className={` ${isSelected || !isOnEdit ? 'opacity-100' : '  opacity-50'} relative`}
        >
            <div className={row_classlist}>
                {NodesRow}
            </div>
            {isSelected && NodeControlButtonStack}

        </div>
    )
}

const FNode: React.FC<FNodeProps> = (NodeProps) => {
    const { isFram, frameType, children } = NodeProps
    const nodeCls = `flex-col   border-8  border-black bg-[#0f66ad] justify-items-start`
    const typeCls = {
        'win': `h-[${isFram ? `4em` : `10em`}] min-w-[5em] border-double `,
        'door': `h-[${isFram ? `4em` : `20em`}] min-w-[8em] border-solid `
    }
    const cls = [nodeCls, typeCls[frameType!]].join(' ')

    return (
        <div className={cls}
        >
            {
                <div className='text-white  mt-2 text-[.8rem] flex-col '>
                    {children}
                </div>
            }
        </div>
    )
}





export class RowFactory {
    genNodes(row_id: string, isFram: boolean, ft: IFrameType) {
        const nodes = [] as { id: string, row_id: string, isFram: boolean, frameType: IFrameType }[]
        return function (count: number) {
            while (count > 0) {
                nodes.push({ id: _ID(), row_id, isFram, frameType: ft })
                count--
            }
            return nodes
        }

    }

    NodesArray(row_id: string, cols: number, isFram: boolean, frameType: IFrameType) {
        const t = frameType
        const ROW = this.genNodes(row_id, isFram, t)
        const NODES = ROW(cols)
        return (
            NODES.map((node, idx) => (<FNode {...node} key={node.id}>{idx + 1}</FNode>))
        )
    }

    Elems(row_id: string, cols: number, isFram: boolean, frameType: IFrameType) {

        const ROW = this.genNodes(row_id, isFram, frameType)
        const NODES = ROW(cols)
        function el(Elem: any): JSX.Element[] {


            return (NODES.map(node => (<Elem {...node} key={node.id} />)))
        }


        return el
    }
    List<T>({ items, renderItem }: ListProps<T>) {
        return (
            <div>
                {items.map(renderItem)}
            </div>
        )
    }
}

interface ListProps<T> {
    items: T[]
    renderItem: (item: T) => RRN
}
const RF = new RowFactory()
