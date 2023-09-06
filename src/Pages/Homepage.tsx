import React, { useMemo, useState } from 'react'
import { CM_Data } from '../CalcModule/Calc_Form'
import { CalcFormBorderExport, ISides } from '../Types/CalcModuleTypes'
import { CalcModel } from '../Models/CalcModels/CalcModel.v1'
import { CalcNode } from "../Models/CalcModels/CalcNode"
import { DIRECTION } from '../Types/Enums'
import { CalcNode_v2 } from '../Models/CalcModels/CalcNode.v2'
import { CNodeService } from '../Models/CalcModels/CNodeService'
import { CalcModel_v2 } from '../Models/CalcModels/CalcModel.v2'
import { MakeNode, dataExtract, filterConnectedNodes, joinConnectedNodes } from '../Models/CalcModels/HelperFns'
import { Size } from '../Models/CalcModels/Size'
import { Impost } from '../Models/CalcModels/Border'
import { DMConstructorLayout } from '../Components/ConstructorDataModel/DMConstructorLayout'


type HomePageProps = {
    children?: React.ReactNode
}


export const Homepage: React.FC<HomePageProps> = () => {

    const [calcForm, setCalcForm] = useState<CalcFormBorderExport | null>(null)
    const [calcModel, setCalcModel] = useState<CalcModel_v2 | null>(null)
    const [test, setTest] = useState<any | null>(null)
    const CNode = useMemo(() => {
        const nn = new CalcNode()
        if (!calcForm) return nn
        // const { w, h } = calcForm
        const nm = new CalcModel(calcForm?.system)
        // const cnv2 = new CalcNode_v2({ w: +w, h: +h })
        if ((calcForm.w && calcForm.h)) nm.setSize({ w: +calcForm.w, h: +calcForm.h })
        nn.initBorders(calcForm?.borders)
            .initDelta(nm.delta)
        // nn.initSize({ h: +calcForm.h, w: +calcForm.w, })
        // .initPos({ x: 0, y: 0 })




        return nn
    }, [calcForm])
    function extractFormData(data: CalcFormBorderExport) { setCalcForm(prev => ({ ...prev, ...data })) }
    function getModel(cdata: CM_Data) {

    }
    const createFn = () => {
        const { w, h } = calcForm!
        const sys = calcForm?.system || 'Proline'
        const size = new Size(w, h)


        const model = new CalcModel_v2(size.w, size.h)
        // console.log('model', model)
        if (!calcModel) setCalcModel(prev => model)
    }

    function onTest() {
        if (!calcForm?.w || !calcForm.h) return console.log('Set Size!')
        const { w, h } = calcForm
        const node = new CalcNode_v2({ w: +w, h: +h }) as Required<CalcNode_v2>
        setTest((prev: CalcModel_v2) => new CalcModel_v2(+w, +h))
        // node.changeBorderState('right', 'imp')

        // console.log('node: ', node)
        const [sn1, sn2] = CNodeService.DevideVertical(node)
        const [sn3, sn4] = CNodeService.DevideVertical(sn2 as Required<CalcNode_v2>)
        const modelnodes = [sn1, sn3, sn4]


        const n0 = MakeNode({ size: new Size(20, 100), pos: [0, 0] })
        n0.loadBordersPreset('LN_Borders')
        // console.log('n1', n1)
        const n1 = MakeNode({ size: new Size(20, 60), pos: [20, 0], })
        n1.loadBordersPreset('RN_Borders')
        n1.setBorder('top', new Impost())

        const n2 = MakeNode({ size: new Size(20, 40), pos: [20, 60], })
        n2.loadBordersPreset('RN_Borders')
        n2.setBorder('bottom', new Impost())

        const n3 = MakeNode({ size: new Size(30, 100), pos: [40, 0], })
        n3.loadBordersPreset('RN_Borders')

        const n4 = MakeNode({ size: new Size(20, 40), pos: [20, 100], })
        n4.loadBordersPreset('RN_Borders')
        n4.setBorder('bottom', new Impost())
        const testnodes = [n1, n2, n3, n4]
        const imp = n0.borders.right
        const filtered = filterConnectedNodes(testnodes, imp)
        // console.log('filtered', filtered)
        const joined = joinConnectedNodes(...filtered)
        const res = n0.absorbNode(joined)

    }
    function clickFn(id: string) {
        calcModel && setCalcModel(prev => prev && prev.addImpost(id, DIRECTION.VERT))
        console.log('model:', calcModel)
    }
    return (
        <div className='container flex-col flex m-1 p-3 bg-[#d6d6d6]'>
            {/* <ConstructorMainRedux /> */}
            {/* <ConstructorUI /> */}
            {/* <FramesLibrary /> */}
            {/* <div className='flex'>
                <CalcForm getFormData={extractFormData} getCalcData={getModel} />
                {calcForm && <CalcOutput incomingData={calcForm} />}
            </div> */}
            {/* <hr className='border-black my-2' />
            <div className='flex gap-6'>
                <button className='border-2 border-green-500 active:bg-lime-400'
                    onClick={createFn}>CreateModel</button>
                <button className='border-2 border-green-500 active:bg-lime-400'
                    onClick={onTest}>TestFn Button</button>
            </div> */}
            {/* <hr className='border-black my-2' /> */}

            <div>
                {/* {calcModel && <ModelView calc_model={calcModel} />} */}
                {/* <ConstructorMainCalcModel /> */}
                <DMConstructorLayout />
            </div>
        </div>
    )
}
type CMViewListProps = {
    model: CalcModel_v2
    onClickFn?: (id: string) => void
}
const CalcModelViewList = ({ model, onClickFn }: CMViewListProps): JSX.Element => {

    const { system, label, size, type } = model
    const [tmodel, setModel] = useState(model)
    function onBorderClickFn(node_id: string) {
        onClickFn && onClickFn(node_id)
        setModel(prev => prev.addImpost(node_id, DIRECTION.VERT))
        // console.log('model', model)
    }
    const ModelDataComponent = (system: any, label: any, type: any) => {
        return (
            <ol className='list-decimal'>
                <li>{system}</li>
                {label && <li>{label}</li>}
                {type && <li>{type}</li>}
                {size && <li>{size.w} - {size.h}</li>}

            </ol>

        )
    }

    const NodeComponent = (Node: CalcNode_v2, idx: number) => {
        const pos = (side: ISides) => side === 'left' || side === 'right' ? `top-1/3 ${side}-0` : `${side}-0 left-1/3`
        const bdrs = dataExtract(Node).array.map(b =>
            <div className={`absolute ${pos(b.side as ISides)}`}
                key={b.border.id}>{b.border.desc}</div>
        )
        const node = <div className={`w-64 h-48 bg-slate-${idx + 3}00 block relative border-2 border-red-600 hover:bg-red-300`}
            key={Node.id}
            onClick={() => onBorderClickFn(Node.id)}>
            {bdrs.map(s => s)}
        </div>


        return node
    }



    return (
        <div className='flex flex-col mx-1 px-1'>
            {(system && label && type) && ModelDataComponent(system, label, type)}
            <div className='border-2 w-fit h-fit bg-red-900 border-black flex'
            >
                {tmodel.nodes.map(NodeComponent)}
            </div>
        </div>
    )
}