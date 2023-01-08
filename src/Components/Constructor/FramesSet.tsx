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


//*****************!   Vertical FramesStack    *********/


const FramesSet = ({ rows, id, onClickFn, isSelected }: IVFrameProps) => {
    const [FRAME, FrameControl] = useGridControl(rows)
    const { current, setVM } = useHookContext()
    const DelFrame = setVM.RemFrame(current.selectedFrameSet)




    const select = (id: string) => {
        onClickFn && onClickFn(id)
    }


    const VMRowsMemed = useMemo(() => FRAME.map((f, idx) => (
        <VMRow {...f}
            key={f.row_id}
            fs_id={id}
            isSelected={isSelected}
            addNode={FrameControl.add}
            remNode={FrameControl.rem}
            isFram={(idx === 0 && FRAME.length === 2)}
        />
    )), [FRAME, isSelected])

    return (

        <div className='relative border-2 border-[#000] flex flex-col bg-gray-700'
            onClick={() => select(id)}
        >

            {
                isSelected &&
                <div className={`absolute 
                                 top-1 flex flex-col z-20 right-0
                                 p-1 max-w-[4em]`}
                >

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
                </div>
            }
            {
                VMRowsMemed
            }


            {
                isSelected &&
                <div className={`top-2  flex justify-around z-22 border-t-2 border-b-2 border-black`}>
                    <button className='border-2 bg-[#078747] p-1 m-1 rounded-md border-[black]'
                        onClick={() => setVM.AddViewFrameTop(current.selectedFrameSet)}
                    >
                        <IcFrameUp hw={8} />
                    </button>
                    <button className='top-1 border-2 bg-[#df1111] p-1 m-1 rounded-md border-[black]'
                        onClick={() => DelFrame(current.selectedFrame)}
                    >
                        <IcTrash hw={6} />
                    </button>
                    <button className='border-2 bg-[#078747] p-1 m-1 rounded-md border-[black]'
                        onClick={() => setVM.AddViewFrameRight()}

                    >
                        <IcFrameRight hw={8} />
                    </button>


                </div>
            }


        </div>

    )
}


const VMRowFrameWrapper: React.FC<VMRChildrenProps> = ({ children, isSelected, isHighlighted }) => {
    let cols = children.length

    const row_classlist = [`columns-${cols}`,
        // ${isSelected ? '  opacity-100' : 'opacity-40'}
        // ${!isSelected ? '' : 'border-8 border-green-500'}
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

//! NodesRow  *************************

const VMRow: React.FC<VMRowProps> = (props) => {
    const { isSelected, fs_id } = props
    const StraightNodesMemed = useMemo(() => setStraightNodes(props.cols, props.row_id), [props])


    return (
        <div className={`relative
         ${isSelected ? ' opacity-100' : 'opacity-30 '}
         `}
        >
            {/* border-2 border-black */}


            <VMRowFrameWrapper isSelected={isSelected} isHighlighted={true}>
                {
                    StraightNodesMemed.map(item =>
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

