/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react'
import { useHookContext } from '../../Context/HookModelCTX'
import { useGridControl } from '../../hooks/useColsControl'
import { useUtils } from '../../hooks/useUtils'
import { ConstructionModel } from '../../Models/WinFrameHookModel'
import { DivProps } from '../../Types'
import { IcFrameRight, IcFrameUp, IcMinus, IcPlus, IcRowDown, IcRowUp, IcTrash } from '../Icons/IconsPack'

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

}
// export type INodeCols = { id: string, row_id: string }
interface VMRChildrenProps extends DivProps {
    children: React.ReactNode[]
    isSelected?: boolean
    isHighlighted?: boolean
}
type VMRowProps = {
    fs_id: string,
    cols: number,
    row_id: string,
    isFram: boolean,
    addNode: (row_id: string) => void,
    remNode: (row_id: string) => void,
    rowUp: () => void,
    rowDown: (row_id?: string) => void
    isSelected?: boolean
    isOnEdit?: boolean
}
type FramesStackProps = {
    isSelected?: boolean
    align?: 'top' | 'bot' | 'mid'
    justify?: 'left' | 'right' | 'mid'
} & DivProps
interface FNodeProps extends IRowID {
    isFram: boolean
    children?: React.ReactNode
}

const _ID = useUtils.stringID


export const ConstructionView: React.FC<IHFramesSet> = (VModel) => {
    const { editInfo: current, setInfo: setCurrent } = useHookContext()
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
                        <FramesSet
                            id={f.id}
                            rows={f.rows}
                            key={f.id}
                            isSelected={f.id === current.selectedFrame}
                            onClickFn={() => selectFrame(fs.id, f.id)}

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
const VStack: React.FC<FramesStackProps> = ({ children, className }) => {
    const cls = 'flex flex-col-reverse ' + className
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
    const cls = (classes?: string) => `flex ${classes} ${frameAlign[align]}`

    return (
        <div className={cls(className)}>
            {children}
        </div>
    )
}


//*****************!   Vertical FramesStack    *********/


const FramesSet = ({ rows, id, onClickFn, isSelected }: IVFrameProps) => {
    const [FRAME, FrameControl] = useGridControl(rows)
    const { editInfo: current, setVM, setInfo: setCurrent } = useHookContext()
    const DelSelFrame = setVM.RemFrame(current.selectedFrameSet)

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
        <div className={`absolute top-2 right-0 flex flex-col z-20 p-1 max-w-[4em]`} >
            <button className='border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black]'
                onClick={() => FrameControl.rowUp()}
            >
                <IcRowUp hw={6} />
            </button>
            <button className='border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black]'
                onClick={() => FrameControl.rowDown()}
            >
                <IcRowDown hw={6} />
            </button>
        </div>, [FRAME])

    return (

        <div className='relative border-2 border-[#000] flex flex-col bg-gray-700'
            onClick={(e) => select(e, id)}
        >
            {
                FRAME.map((f, idx) => (
                    <VMRow {...f}
                        key={f.row_id}
                        fs_id={id}
                        isSelected={isSelected}
                        isOnEdit={current.isEditing}
                        addNode={FrameControl.add}
                        remNode={FrameControl.rem}
                        rowUp={FrameControl.rowUp}
                        rowDown={FrameControl.rowDown}
                        isFram={(idx === 0 && FRAME.length === 2)}
                    />
                ))
            }

            {isSelected && VStackControlButtons}
            {isSelected && RowButtonStack}


        </div>

    )
}




//! NodesRow  *************************


const VMRow: React.FC<VMRowProps> = (props) => {
    const { isSelected, isOnEdit } = props
    // const ViewRow = setStraightNodes(props.cols, props.row_id)
    const NODES = useMemo(() => RF.NodesArray(props.row_id, props.cols, props.isFram), [props.row_id, props.cols, props.isFram])



    const NodeControlButtonStack = useMemo(() =>
        <div className={`absolute p-1 z-22  bottom-1 flex flex-col`}  >
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
        </div>
        , [props.row_id])

    const row_classlist = [`columns-${props.cols}`, `gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-t-0 border-b-0 `].join(' ')
    return (
        <div className={` ${isSelected || !isOnEdit ? ' opacity-100' : 'opacity-30 '} relative`}
        >
            <div className={row_classlist}>
                {
                    NODES
                }
            </div>
            {isSelected && NodeControlButtonStack}

        </div>
    )
}

const FNode: React.FC<FNodeProps> = (item) => {

    return <div className={`flex-col  min-w-[5em] border-8 border-double border-black bg-[#0f66ad] justify-items-start 
        h-[${item.isFram ? `4em` : `10em`}]`}
    >
        {
            <div className='text-white  mt-2 text-[.8rem] flex-col'>
                {item.children}
            </div>
        }
    </div>
}





export class RowFactory {
    genNodes(row_id: string, isFram: boolean) {
        const nodes = [] as { id: string, row_id: string, isFram: boolean }[]
        return function (count: number) {
            while (count > 0) {
                nodes.push({ id: _ID(), row_id, isFram })
                count--
            }
            return nodes
        }

    }

    NodesArray(row_id: string, cols: number, isFram: boolean) {
        const ROW = this.genNodes(row_id, isFram)
        const NODES = ROW(cols)


        return (
            NODES.map((node, idx) => (<FNode {...node} key={node.id}>{idx + 1}_{node.row_id}</FNode>))
        )
    }


}


const RF = new RowFactory()