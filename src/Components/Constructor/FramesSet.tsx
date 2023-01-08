/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState, useEffect } from 'react'
import { useConstructCtx } from '../../Context/ConstructCTX'
import { useHookContext } from '../../Context/HookModelCTX'
import { useGridControl } from '../../hooks/useColsControl'
import { useUtils } from '../../hooks/useUtils'
import { ConstructionModel } from '../../Models/WinFrameHookModel'
import { DivProps } from '../../Types'
import { IFrameRow } from '../../Types/ModelsTypes'
import { IcFrameDown, IcFrameRight, IcFrameUp, IcMinus, IcPlus, IcRowDown, IcRowUp, IcTrash } from '../Icons/IconsPack'

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
    VFSets: IViewFrame[]
    id: string
    title?: string
}

export interface IViewFrame {
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
    isFram: boolean
    addNode: (row_id: string) => void,
    remNode: (row_id: string) => void,
    isSelected?: boolean
}

interface FNodeProps extends IRowID {
    isFram: boolean
    children?: React.ReactNode
}

const genID = useUtils.stringID
export const FullConstructView: React.FC<IHFramesSet> = (VModel) => {
    const { current, setCurrent } = useHookContext()
    const { VFSets } = VModel
    const selectFrame = (fs_id: string, f_id: string) => {
        setCurrent && setCurrent((prev: any) => ({
            ...prev,
            selectedFrame: f_id,
            selectedFrameSet: fs_id,
            isEditing: true,
        }))
    }
    const ViewModelMemed = useMemo(() => VFSets?.map((fs) =>
        <VStack key={fs.id}
        >
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


    return (
        <HStack align='top'
        >
            {
                VFSets && ViewModelMemed

            }
        </HStack>
    )
}

//*****************!   Vertical FramesStack    *********/


const FramesSet = ({ rows, id, onClickFn, isSelected }: IVFrameProps) => {
    const [FRAME, FrameControl] = useGridControl(rows)
    const { current, setVM, ViewModel } = useHookContext()
    const DelSelFrame = setVM.RemFrame(current.selectedFrameSet)
    const isEmpty = (frameSet_id: string) => ViewModel.VFSets.some(vf => vf.id === frameSet_id && vf.frames.length === 0)
    const DeleteFn = (frame_id: string) => {
        console.log('isEmpty', isEmpty(current.selectedFrame))

        DelSelFrame(frame_id)
    }



    const select = (id: string) => {
        onClickFn && onClickFn(id)
    }


    const MemedRowList = useMemo(() => FRAME.map((f, idx) => (
        <VMRow {...f}
            key={f.row_id}
            fs_id={id}
            isSelected={isSelected}
            addNode={FrameControl.add}
            remNode={FrameControl.rem}
            isFram={(idx === 0 && FRAME.length === 2)}
        />
    )), [FRAME, isSelected])

    const ButtonStackBot = useMemo(() => (
        <div className={`top-2  flex justify-around z-22 border-t-2 border-b-2 border-black`}>
            <button className='border-2 bg-[#078747] p-1 m-1 rounded-md border-[black]'
                onClick={() => setVM.AddViewFrameTop(current.selectedFrameSet)}
            >
                <IcFrameUp hw={8} />
            </button>
            <button className='top-1 border-2 bg-[#df1111] p-1 m-1 rounded-md border-[black]'
                onClick={() => DeleteFn(current.selectedFrame)}
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

    const ButtonStackTop = useMemo(() =>
        <div className={`absolute top-1 flex flex-col z-20 right-0  p-1 max-w-[4em]`} >
            <button className='top-1 border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black]'
                onClick={() => FrameControl.rowUp()}
            >
                <IcRowUp hw={6} />
            </button>

            <button className='top-8 border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black]'
                onClick={() => FrameControl.rowDown()}
            >
                <IcRowDown hw={6} />
            </button>
        </div>, [current.selectedFrame, current.selectedFrameSet])

    return (

        <div className='relative border-2 border-[#000] flex flex-col bg-gray-700'
            onClick={() => select(id)}
        >

            {
                isSelected && ButtonStackTop

            }
            {
                MemedRowList
            }


            {
                isSelected && ButtonStackBot

            }


        </div>

    )
}




//! NodesRow  *************************

const VMRow: React.FC<VMRowProps> = (props) => {
    const { isSelected, fs_id } = props
    const ViewRow = setStraightNodes(props.cols, props.row_id)
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
    const ButtonStack = useMemo(() =>
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

    return (
        <div className={`relative
         ${isSelected ? ' opacity-100' : 'opacity-30 '}
         `}
        >


            <VMRowFrameWrapper isSelected={isSelected} isHighlighted={true}>
                {
                    // StraightNodesMemed.map(item =>
                    ViewRow.map(item =>
                    (
                        <FNode key={item.id}
                            isFram={props.isFram}
                            row_id={item.row_id}
                        >
                            {fs_id}
                        </FNode>
                    ))
                }
            </VMRowFrameWrapper>

            {isSelected && ButtonStack
                // <div className={`absolute p-1   
                //  z-22  bottom-1 flex flex-col`}  >


                //     <button className='bg-[#931dca]  p-1 m-1 rounded-md border-[#8a8a8a]'
                //         onClick={() => props.addNode(props.row_id)}
                //     >
                //         <IcPlus hw={6} />
                //     </button>
                //     <button className='bg-[#931dca] p-1  m-1 rounded-md border-[#8a8a8a]'
                //         onClick={() => props.remNode(props.row_id)}
                //     >
                //         <IcMinus hw={6} />
                //     </button>
                // </div>
            }

        </div>
    )
}

const FNode: React.FC<FNodeProps> = (item) => {

    return <div className={`flex-col  min-w-[5em] border-8 border-double border-black bg-[#0f66ad] justify-items-start 
        h-[${item.isFram ? `4em` : `10em`}]`}
    >

        {
            <div className='text-white  mt-2 text-[.8rem] flex-col'>

                {
                    // item.row_id && item.row_id
                }
                {item.children}
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

interface TestFrameProps<T> {
    rows: T[]
    renderRow: (item: T) => React.ReactNode
}


function TestFrame<T>(props: TestFrameProps<T>) {

    return (
        <div>
            {props.rows.map(props.renderRow)}
        </div>
    )
}


type FramesStackProps = {
    children?: React.ReactNode
    isSelected?: boolean
    align?: 'top' | 'bot' | 'mid'
    justify?: 'left' | 'right' | 'mid'
} & DivProps
const VStack: React.FC<FramesStackProps> = ({ children, className }) => {
    const cls = className ? 'flex flex-col-reverse ' + className : 'flex flex-col-reverse  z-0'
    if (!children) return <>NULL</>
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
const BlurWrap: React.FC<{ children?: React.ReactNode } & DivProps> = ({ children }) => {
    return (
        <div className='flex w-100 h-100 bg-black'>
            {children}
        </div>
    )
}

//  <TestFrame
//                 rows={rows}
//                 renderRow={(row) => (
//                     <VMRow
//                         {...row}
//                         key={row.row_id}
//                         fs_id={id}
//                         isSelected={isSelected}
//                         addNode={FrameControl.add}
//                         remNode={FrameControl.rem}
//                         isFram={false}
//                     />)
//                 }
//             />