import React, { useEffect, useMemo, useState } from 'react'
import { ConstructorMain } from '../_testing_scripts/ConstructorMain'
import { ConstructorMainRedux } from '../Components/Constructor/ConstructorMainRedux'
import { FramesLibrary } from '../Components/FramesLibrary/FramesLibrary'
import { ConstructorUI } from '../Components/OffsetConstructor/index'
import { CM_Data, CalcForm } from '../CalcModule/Calc_Form'
import { CalcOutput } from '../CalcModule/Calc_Output'
import { IProfileSystem, IBorderState } from '../CalcModule/GlassDelta'
import { ISide } from '../Types/FrameTypes'
import { CalcFormBorderExport, IBorders, INodeBorder, ISideStateValues, Sides2Arr } from '../Types/CalcModuleTypes'
import { CalcModel } from '../Models/CalcModels/CalcModel.v1'
import { CalcNode } from "../Models/CalcModels/CalcNode"
import { CModel_v1Service } from '../Models/CalcModels/CalcModelControl'
import { DIR } from '../Types/Enums'
import { CalcNode_v2 } from '../Models/CalcModels/CalcNode.v2'
import { CNodeService } from '../Models/CalcModels/CNodeService'
import { CModelService, CalcModel_v2 } from '../Models/CalcModels/CalcModel.v2'


type HomePageProps = {
    children?: React.ReactNode
}


export const Homepage: React.FC<HomePageProps> = () => {

    const [calcForm, setCalcForm] = useState<CalcFormBorderExport | null>(null)
    const [calcModel, setCalcModel] = useState<CalcModel_v2 | null>(null)
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
        const size = { w: +w, h: +h }

        const nb = calcForm!.borders.map(b => b.side === 'bot' ? { ...b, side: 'bottom' } : b)
            .map(b => ({ side: b.side!, state: b.state!, desc: b.desc }))


        const new_borders = nb!.reduce((result, b) => {
            result[b.side as keyof IBorders] = b
            return result
        }, {} as IBorders)

        const Node2 = new CalcNode_v2(size).setBorders(new_borders)
        const M2 = CModelService.CreateNew({ sys, size })
            .setNodes(Node2)

        setCalcModel(prev => M2)
    }
    useEffect(() => {


        // calcForm && setCalcModel(new CalcModel().setParams({ system: calcForm?.system }).setNodes([CNode]))

        // if ((calcForm && calcForm.w && calcForm.h)) setCalcModel(prev => prev!.changeSize({ w: +calcForm.w, h: +calcForm.h }))

    }, [CNode, calcForm])
    return (
        <div className='container flex-col flex m-1 p-3 bg-[#d6d6d6]'>
            {/* <ConstructorMainRedux /> */}
            {/* <ConstructorUI /> */}
            {/* <FramesLibrary /> */}
            <div className='flex'>
                <CalcForm getFormData={extractFormData} getCalcData={getModel} />
                {calcForm && <CalcOutput incomingData={calcForm} />}
            </div>
            <hr className='border-black my-2' />
            <div>
                <button className='border-2 border-green-500 active:bg-lime-400'
                    onClick={createFn}>CreateModel</button>
            </div>
            <hr className='border-black my-2' />
            <div>
                {calcModel && <CalcModelViewList model={calcModel} />}
            </div>
        </div>
    )
}
type CMViewListProps = {
    model: CalcModel_v2
}
const CalcModelViewList = ({ model }: CMViewListProps): JSX.Element => {

    const { nodes, system, Pos, label, Size, type } = model

    const ModelDataComponent = (system: any, label: any, type: any) => {
        return (
            <ol className='list-decimal'>
                <li>{system}</li>
                {label && <li>{label}</li>}
                {type && <li>{type}</li>}
            </ol>

        )
    }

    const NodeComponent = (Node: CalcNode_v2, idx: number) => {
        // const pos = (side: ISide) => side === 'left' || side === 'right' ? `top-1/3 ${side}-0` : side === 'bot' ? `${side}tom-0 ` : `${side}-0`
        // const Borders = Node.borders?.map(b => getBorderEl(b))
        // const getBorderEl = (b: IBorders, idx: number) => (        <div className={`${b.side} bg-amber-400  w-fit absolute text-xs`} key={b.side}>({b.side}){b.desc}</div>)
        const ss = Sides2Arr.map(side => {

            return <div key={Node.borders[side].state}>{Node.borders[side].desc}</div>
        })



        return (
            <div className={`w-64 h-48 bg-slate-${idx + 3}00 block relative border-2 border-red-600 hover:bg-red-300`}
                key={Node.id}
                onClick={() => clickFn(Node.id)}>
                {ss.map(s => s)}
            </div>)
    }

    function clickFn(node_id: string) {
        // model.AddImpost(node_id, DIR.vertical)

        console.log('model', model)
    }

    return (
        <div className='flex flex-col mx-1 px-1'>
            {(system && label && type) && ModelDataComponent(system, label, type)}
            <div className='border-2 w-fit h-fit bg-red-900 border-black flex'
            >
                {nodes && nodes.map(NodeComponent)}
            </div>
        </div>
    )
}