import React, { useMemo, useState } from 'react'
import { CalcModel_v2 } from '../../Models/CalcModels/CalcModel.v2'
import { CalcNode_v2 } from '../../Models/CalcModels/CalcNode.v2'
import { MakeNode, dataExtract } from '../../Models/CalcModels/HelperFns'
import { ISides2 } from '../../Types/CalcModuleTypes'
import { Border, Impost } from '../../Models/CalcModels/Border'
import { DIRECTION } from '../../Types/Enums'
import { Size } from '../../Models/CalcModels/Size'
import { useNodeCoords } from '../../hooks/useNodeCoords'
import { useNodeDataExtract_v2 } from '../../hooks/useNodeDataExtract'
import { useModelDataExtract } from '../../hooks/useModelDataExtract'
import { useViewNode } from '../../hooks/useViewNode'

type ModelViewProps = {
    calc_model: CalcModel_v2
}

// const nc2 = new CalcNode_v2({ w: 8, h: 12 }).changePos({ x: 0, y: 12 })
export const ModelView = ({ calc_model }: ModelViewProps) => {
    const model = useModelDataExtract(calc_model)

    return (
        <div>
            <div className='relative p-2'>
                <NodesFcWrapper>
                    {
                        model.baseNode && model.nodes.length < 1 &&
                        <NodeFc node={model.baseNode} scale={1} />
                    }
                    {
                        model.nodes.length >= 1 &&
                        model.nodes.map(n =>
                            <NodeFc node={n} scale={1} key={n.id} />
                        )
                    }
                </NodesFcWrapper>

            </div>

        </div>
    )
}

type NodeFcWrapperProps = {
    children?: React.ReactNode
}
const NodesFcWrapper = ({ children }: NodeFcWrapperProps) => {
    return (
        <div className='relative border-2 border-red-900 bg-slate-200 max-w-96 max-h-96 w-[30em] h-[30em]'>
            {children}
        </div>
    )
}
type NodeFcProps = {
    node: CalcNode_v2
    scale?: number
    children?: React.ReactNode
}
const NodeFc: React.FC<NodeFcProps> = ({ node, scale }) => {
    const { coords, borders, id } = useNodeDataExtract_v2(node, scale)
    const [viewNode, nodeAction] = useViewNode(node)

    const [selected, setSelected] = useState({})
    const [x, y, ox, oy] = coords
    const [w, h] = [ox - x, oy - y]

    const [left, bot] = [` left-[${x}em] `, ` bottom-[${y}em] `]
    const [width, height] = [`w-[${w}em] `, ` h-[${h}em] `]

    const borderSide = (side: ISides2) => borders.find(b => b.side === side)!.border
    const borderSideFC = (side: ISides2) => BorderGridComponent(side, borderSide(side))



    return (
        <div className={`${left + bot} ${width + height} absolute border-2 border-black`}>

            <BordersGrid sideBorders={{
                left: borderSideFC('left'),
                top: borderSideFC('top'),
                right: borderSideFC('right'),
                bottom: borderSideFC('bottom'),
            }} >
                <ul className='text-sm'>
                    <li><b>{id}</b></li>
                    <li>x0: {x}</li>
                    <li>y0: {y}</li>
                    <li>ox: {ox}</li>
                    <li>oy: {oy}</li>

                </ul>
            </BordersGrid>


        </div>
    )
}



const BorderGridComponent = (side: ISides2, border: Border) => {
    const cell_size = ['left', 'right'].includes(side) ? 'h-full w-5' : 'w-full h-5'
    const cell_display = ['left', 'right'].includes(side) ? 'flex place-items-center' : "flex justify-center place-items-center"
    const coords = border.coords
    const getCoords = () => {
        console.log(`coords_${side}: `, coords)
        return coords
    }
    const clickFn = () => {
        getCoords()

    }
    return <div onClick={clickFn}
        className={`bg-slate-500 text-center text-black ${cell_size} ${cell_display} 
 truncate 
                    `}>
        {border.desc}

    </div>
}

type BordersGridComponentProps = {
    sideBorders: Record<ISides2, React.ReactNode>
    children?: React.ReactNode
    onClick?: (id: string) => void
}
const BordersGrid = ({ sideBorders: borders, children }: BordersGridComponentProps) => {
    const [selected, setSelected] = useState<Border | { id: "" }>({ id: "" } as Border)



    return (
        <div className={`bg-red-500 w-full h-full relative`}>
            <div className='grid grid-cols-[1rem_1fr_1rem] grid-rows-[1rem_1fr_1rem] w-full h-full absolute bg-red-200 justify-between place-items-center place-content-center'>

                <div className='h-full   w-full flex place-items-center'>                </div>

                {borders.top}

                <div className='h-full   w-full flex place-items-center'>                </div>

                {borders.left}

                <div className='border-2 border-black w-full h-full flex place-items-center justify-center z-10'>{children}</div>

                {borders.right}


                <div className='h-full   w-full flex place-items-center'>                </div>

                {borders.bottom}


                <div className='h-full   w-full flex place-items-center'>                </div>
            </div>

        </div>
    )
}





// const n0 = MakeNode({ size: new Size(20, 100), pos: [0, 0] })
// n0.loadBordersPreset('LN_Borders')
// // console.log('n1', n1)
// const n1 = MakeNode({ size: new Size(20, 60), pos: [20, 0], })
// n1.loadBordersPreset('RN_Borders')
// n1.setBorder('top', new Impost())

// const n2 = MakeNode({ size: new Size(20, 40), pos: [20, 60], })
// n2.loadBordersPreset('RN_Borders')
// n2.setBorder('bottom', new Impost())

// const n3 = MakeNode({ size: new Size(30, 100), pos: [40, 0], })
// n3.loadBordersPreset('RN_Borders')

// const n4 = MakeNode({ size: new Size(20, 40), pos: [20, 100], })
// n4.loadBordersPreset('RN_Borders')
// n4.setBorder('bottom', new Impost())
// const testnodes = [n1, n2, n3, n4]