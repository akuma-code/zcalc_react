/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react'
import { useHookContext } from '../../Context/HookModelCTX'
import { useGridControl } from '../../hooks/useColsControl'
import { useUtils } from '../../hooks/useUtils'
import { ConstructionModel } from '../../Models/WinFrameHookModel'
import { DivProps } from '../../Types'
import { IFrameRow } from '../../Types/ModelsTypes'
import { IcFrameRight, IcFrameUp, IcMinus, IcPlus, IcRowDown, IcRowUp, IcTrash } from '../Icons/IconsPack'

type IRowID = { row_id: string, id?: string }
export type IGridConstProps = Pick<ConstructionModel, 'rows'> & { id: string, frCode?: string }
type IFrameType = 'door' | 'win'
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
    syncFrames: (frame_id: string, newframes: IFrameRow[]) => void
    setHFrameStack: React.Dispatch<React.SetStateAction<IHFramesSet>>
    changeCols: (vfs_id: string, f_id: string) => {
        UP: (row_id: string) => void
        Down: (row_id: string) => void
    }
}
// export type INodeCols = { id: string, row_id: string }

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
    nodeType?: 'door' | 'win'
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


const FramesSet = (props: IVFrameProps) => {
    const { rows, id: fs_id, onClickFn, isSelected } = props
    const [FRAME, FrameControl] = useGridControl(rows)
    const { editInfo: current, setVM, setInfo: setCurrent } = useHookContext()
    const DelSelFrame = setVM.RemFrame(current.selectedFrameSet)

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
    }, [FRAME])


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
            {FRAME.length > 1 &&
                <button className='border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black]'
                    onClick={() => FrameControl.rowDown()}
                >
                    <IcRowDown hw={6} />
                </button>}
        </div>, [FRAME])

    return (

        <div className='relative border-2 border-[#000] flex flex-col bg-gray-700'
            onClick={(e) => select(e, fs_id)}
        >
            {
                FRAME.map((f, idx) => (
                    <VMRow {...f}
                        key={f.row_id}
                        fs_id={fs_id}
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


const VMRow: React.FC<VMRowProps> = (props) => {
    const { isSelected, isOnEdit } = props
    const [ft, setFt] = useState<IFrameType>('win')
    // const ViewRow = setStraightNodes(props.cols, props.row_id)
    const NODES = useMemo(() => RF.NodesArray(props.row_id, props.cols, props.isFram, ft),
        [props.row_id, props.cols, props.isFram, ft])
    const Elems = useMemo(() => RF.Elems(props.row_id, props.cols, props.isFram), [props.row_id, props.cols, props.isFram])



    const NodeControlButtonStack = useMemo(() =>
        <div className={`absolute p-1 z-22  bottom-1 flex flex-col`}  >
            {props.cols > 1 &&
                <button className='bg-[#931dca] p-1  m-1 rounded-md border-[#8a8a8a]'
                    onClick={() => props.remNode(props.row_id)}
                >
                    <IcMinus hw={6} />
                </button>
            }

            <button className='bg-[#931dca]  p-1 m-1 rounded-md border-[#8a8a8a]'
                onClick={() => props.addNode(props.row_id)}
            >
                <IcPlus hw={6} />
            </button>
            <button className='left-[-2em] absolute'
                onClick={() => setFt(prev => prev === 'door' ? 'win' : 'door')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M12 1.5c-1.921 0-3.816.111-5.68.327-1.497.174-2.57 1.46-2.57 2.93V21.75a.75.75 0 001.029.696l3.471-1.388 3.472 1.388a.75.75 0 00.556 0l3.472-1.388 3.471 1.388a.75.75 0 001.029-.696V4.757c0-1.47-1.073-2.756-2.57-2.93A49.255 49.255 0 0012 1.5zm-.97 6.53a.75.75 0 10-1.06-1.06L7.72 9.22a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06l-.97-.97h3.065a1.875 1.875 0 010 3.75H12a.75.75 0 000 1.5h1.125a3.375 3.375 0 100-6.75h-3.064l.97-.97z" clipRule="evenodd" />
                </svg>

            </button>

        </div>
        , [props.row_id, props.cols])

    const row_classlist = [`columns-${props.cols}`, `gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-t-0 border-b-0 `].join(' ')
    return (
        <div className={` ${isSelected || !isOnEdit ? ' opacity-100' : 'opacity-30 '} relative`}
        >
            <div className={row_classlist}>
                {Elems(FNode)}
            </div>
            {isSelected && NodeControlButtonStack}

        </div>
    )
}

const FNode: React.FC<FNodeProps> = (props) => {
    const { nodeType } = props
    switch (nodeType) {
        case ('win'):
            return (
                <div className={`flex-col  min-w-[5em] border-8 border-double border-black bg-[#0f66ad] justify-items-start 
                 h-[${props.isFram ? `4em` : `10em`}]`}
                >
                    {
                        <div className='text-white  mt-2 text-[.8rem] flex-col'>
                            {props.children}
                        </div>
                    }
                </div>
            );

        case ('door'):
            return (
                <div className={`flex-col  min-w-[5em] border-8 border-double border-black bg-[#0f66ad] justify-items-start h-[${props.isFram ? `4em` : `18em`}]`}
                >
                    {
                        <div className='text-white  mt-2 text-[.8rem] flex-col'>
                            {props.children}
                        </div>
                    }
                </div>
            )
        default:
            return (
                <div className={`flex-col  min-w-[5em] border-8 border-double border-black bg-[#0f66ad] justify-items-start h-[${props.isFram ? `4em` : `10em`}]`}
                >
                    {
                        <div className='text-white  mt-2 text-[.8rem] flex-col'>
                            {props.children}
                        </div>
                    }
                </div>
            )
    }

}





export class RowFactory {
    genNodes(row_id: string, isFram: boolean, ft: IFrameType) {
        const nodes = [] as { id: string, row_id: string, isFram: boolean, nodeType: IFrameType }[]
        return function (count: number) {
            while (count > 0) {
                nodes.push({ id: _ID(), row_id, isFram, nodeType: ft })
                count--
            }
            return nodes
        }

    }

    NodesArray(row_id: string, cols: number, isFram: boolean, frameType: IFrameType) {
        const t = frameType
        const ROW = this.genNodes(row_id, isFram, t)
        const NODES = ROW(cols)
        console.log('NODES', NODES)
        return (
            NODES.map((node, idx) => (<FNode {...node} key={node.id}>{idx + 1}</FNode>))
        )
    }

    Elems(row_id: string, cols: number, isFram: boolean) {
        const ROW = this.genNodes(row_id, isFram)
        const NODES = ROW(cols)
        const el = (Elem: any): JSX.Element[] => (NODES.map(node => (<Elem {...node} key={node.id} />)))
        return el
    }

}


const RF = new RowFactory()