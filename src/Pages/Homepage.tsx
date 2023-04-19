import React, { useEffect, useMemo, useState } from 'react'
import { ConstructorMain } from '../_testing_scripts/ConstructorMain'
import { ConstructorMainRedux } from '../Components/Constructor/ConstructorMainRedux'
import { FramesLibrary } from '../Components/FramesLibrary/FramesLibrary'
import { ConstructorUI } from '../Components/OffsetConstructor/index'
import { CM_Data, CalcForm } from '../CalcModule/Calc_Form'
import { CalcOutput } from '../CalcModule/Calc_Output'
import { IProfileSystem, IBorderState } from '../CalcModule/GlassDelta'
import { ISide } from '../Types/FrameTypes'
import { CalcFormBorderExport, INodeBorder, ISideStateValues } from '../Types/CalcModuleTypes'
import { CalcModel } from '../Models/CalcModels/CalcModels'
import { CalcNode } from "../Models/CalcModels/CalcNode"
import { CMService } from '../Models/CalcModels/CalcModelControl'
import { DIR } from '../Types/Enums'


type HomePageProps = {
    children?: React.ReactNode
}


export const Homepage: React.FC<HomePageProps> = () => {

    const [calcForm, setCalcForm] = useState<CalcFormBorderExport | null>(null)
    const [calcModel, setCalcModel] = useState<CalcModel>(new CalcModel('Proline'))
    const CNode = useMemo(() => {
        const nn = new CalcNode()
        if (!calcForm) return nn
        const nm = new CalcModel(calcForm?.system)
        if ((calcForm.w && calcForm.h)) nm.setSize({ w: +calcForm.w, h: +calcForm.h })
        nn.initBorders(calcForm?.borders)
            .initDelta(nm.delta)
        // nn.initSize({ h: +calcForm.h, w: +calcForm.w, })
        // .initPos({ x: 0, y: 0 })




        return nn
    }, [calcForm])
    function extractFormData(data: CalcFormBorderExport) { setCalcForm(prev => ({ ...prev, ...data })) }
    function getModel(cdata: CM_Data) {
        // console.log('cdata', cdata)
        // const node = new CalcNode()
        // node.initBorders(cdata.borders)

        // const M = calcModel
        // M.setSize(cdata.modelSize)
        //     .setPos({ x: 0, y: 0 })
        //     .setNodes(node)
        // setCalcModel(prev => ({...prev, ...calcModel}))
        // const newNode = new CalcNode({ NSize: cdata.modelSize }).initBorders(cdata.borders)
        // cdata.modelSize.w && cdata.modelSize.h && calcModel.setSize(cdata.modelSize)
        // cdata.modelSize.w && cdata.modelSize.h && calcModel.setNodes(newNode)
    }
    const createFn = () => {
        const { w, h } = calcForm!
        const sys = calcForm?.system || 'Proline'
        const cmmodel = CMService.createModel(sys, { w: +w, h: +h })
        setCalcModel(prev => cmmodel)
        console.log('cmmodel', cmmodel)
    }
    useEffect(() => {


        calcForm && setCalcModel(new CalcModel().setParams({ system: calcForm?.system }).setNodes([CNode]))

        if ((calcForm && calcForm.w && calcForm.h)) setCalcModel(calcModel.setSize({ w: +calcForm.w, h: +calcForm.h }).setPos({ x: 10, y: 10 }))
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
    model: CalcModel
}
const CalcModelViewList = ({ model }: CMViewListProps): JSX.Element => {

    const { data, nodes, system, mPos, label, MSize, type } = model

    const ModelDataComponent = (system: any, label: any, type: any) => {
        return (
            <ol className='list-decimal'>
                <li>{system}</li>
                {label && <li>{label}</li>}
                {type && <li>{type}</li>}
            </ol>

        )
    }

    const NodeComponent = (Node: CalcNode, idx: number) => {
        const pos = (side: ISide) => side === 'left' || side === 'right' ? `top-1/3 ${side}-0` : side === 'bot' ? `${side}tom-0 ` : `${side}-0`


        const getBorderEl = (b: INodeBorder, idx: number) => <div className={`${pos(b.side)} bg-amber-400  w-fit absolute text-xs`} key={b.side}>({b.side}){b.desc}</div>
        // const Borders = Node.borders?.map(b => getBorderEl(b))

        return <div className={`w-64 h-48 bg-slate-${idx + 3}00 block relative border-2 border-red-600 hover:bg-red-300`}
            key={Node.id}
            onClick={() => clickFn(Node.id)}>
            {Node.borders?.map(getBorderEl)}
        </div>
    }

    function clickFn(node_id: string) {
        model.AddImpost(node_id, DIR.vertical)

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