import React, { ChangeEvent, SelectHTMLAttributes, useEffect, useRef, useState } from 'react'
import GlassDelta, { IProfileSystem, IBorderState } from './GlassDelta'
import { ISide, ISize } from '../Types/FrameTypes'
import { CM_Node, CalcFormBorderExport, INodeBorder, INodeState, INodeVariant, ISideStateValues } from '../Types/CalcModuleTypes'
import { BorderDescEnum, ProfileVekaEnum } from '../Types/Enums'
import { CalcModel } from '../Models/CalcModels/CalcModel.v1'

type Props = {
    getFormData: (data: CalcFormBorderExport) => void
    getCalcData: (data: CM_Data) => void
}
export const BordersTemplate = {
    FixRama: [
        { side: 'top', state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'bot', state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'left', state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'right', state: 'rama', desc: BorderDescEnum['rama'] },
    ],
    StvRama: [
        { side: 'top', state: 'stv_rama', desc: BorderDescEnum['stv_rama'] },
        { side: 'bot', state: 'stv_rama', desc: BorderDescEnum['stv_rama'] },
        { side: 'left', state: 'stv_rama', desc: BorderDescEnum['stv_rama'] },
        { side: 'right', state: 'stv_rama', desc: BorderDescEnum['stv_rama'] },
    ]
}

const initBorders: CalcFormBorderExport = {
    system: 'Proline',
    state: 'fix',
    nodeType: 'win',
    borders: [
        { side: 'top', state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'bot', state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'left', state: 'rama', desc: BorderDescEnum['rama'] },
        { side: 'right', state: 'rama', desc: BorderDescEnum['rama'] },
    ],
    h: "",
    w: ""
}
export type CM_Data = {
    system: IProfileSystem
    state: INodeState
    nodeType: INodeVariant
    borders: INodeBorder[]
    modelSize: { w: number, h: number }
}

export const CalcForm: React.FC<Props> = ({ getFormData, getCalcData }) => {
    const [data, setData] = useState(initBorders)
    const [cmData, setCmData] = useState<CM_Data>({} as CM_Data)
    const sys = useRef<HTMLSelectElement | null>(null)

    const changeBorder = (s: ISide, new_state: ISideStateValues) =>
        setData(prev => ({
            ...prev, borders: prev.borders.map(b => b.side === s ?
                { ...b, state: new_state, desc: BorderDescEnum[new_state] } : b)
        }))
    // useEffect(() => {
    //     getFormData(data)
    //     setCmData(prev => ({
    //         ...prev, borders: data.borders,
    //         nodeType: data.nodeType,
    //         modelSize: { w: +data.w, h: +data.h },
    //         system: data.system,
    //         state: data.state
    //     }))
    //     if (!cmData) return
    //     getCalcData(cmData)

    // }, [])
    useEffect(() => {
        getFormData(data)
        setCmData(prev => ({
            ...prev, borders: data.borders,
            nodeType: data.nodeType,
            modelSize: { w: +data.w, h: +data.h },
            system: data.system,
            state: data.state
        }))
        if (!cmData) return
        getCalcData(cmData)
    }, [data])


    return (
        <form id='fff' >


            <div className='flex flex-row gap-4'>
                <div className="flex flex-col gap-4">

                    <select name="system" ref={sys} defaultValue={'Proline'}
                        onChange={(e) => setData(prev => ({ ...prev, system: e.target.value as IProfileSystem }))}>
                        <option value={'Proline'}>Proline</option>
                        <option value={'Softline'}>Softline</option>
                        <option value={'WHS60'}>WHS60</option>
                        <option value={'WHS72'}>WHS72</option>
                    </select>
                    <select name="state" defaultValue={'fix'} onChange={(e) => setData(prev => ({ ...prev, state: e.target.value as INodeState }))}>
                        <option value={'fix'}>FIX</option>
                        <option value={'stv'}>STV</option>
                        <option value={'shtulp'}>SHTULP</option>
                    </select>
                    <select name="nodeType" defaultValue={'win'} onChange={(e) => setData(prev => ({ ...prev, nodeType: e.target.value as INodeVariant }))}>
                        <option value={'win'}>WIN</option>
                        <option value={'door'}>DOOR</option>
                    </select>
                    <input type="number" placeholder='Width' onChange={(e) => setData(prev => ({ ...prev, w: e.target.value }))} defaultValue={""} />
                    <input type="number" placeholder='Height' onChange={(e) => setData(prev => ({ ...prev, h: e.target.value }))} defaultValue={""} />
                    {/* <button type="submit" className='bg-slate-600' formTarget='fff'>Submit</button> */}
                </div>
                <div className="flex flex-col gap-4">
                    <SideSelect system={data.system} side='top' changeFn={(e) => changeBorder('top', e.target.value as ISideStateValues)} />
                    <SideSelect system={data.system} side='bot' changeFn={(e) => changeBorder('bot', e.target.value as ISideStateValues)} />
                    <SideSelect system={data.system} side='left' changeFn={(e) => changeBorder('left', e.target.value as ISideStateValues)} />
                    <SideSelect system={data.system} side='right' changeFn={(e) => changeBorder('right', e.target.value as ISideStateValues)} />
                </div>
            </div>
        </form>
    )
}
type SideSelectProps = {
    system: keyof typeof ProfileVekaEnum
    side: ISide
    changeFn: (e: React.ChangeEvent<HTMLSelectElement>) => void
}


const SideSelect: React.FC<SideSelectProps> = ({ system, side, changeFn }) => {
    const sel = useRef<null | HTMLSelectElement>(null)
    const options = Object.keys(GlassDelta[system]) as IBorderState[typeof system][]

    return (
        <fieldset className='border-black border-solid border-2 p-1'>
            <legend >{side.toUpperCase()}</legend>

            <select className='mx-1' ref={sel} defaultValue={'rama'} onChange={changeFn} >
                {options.map((o, ind) =>
                    <option value={o} key={ind}>{BorderDescEnum[o]}</option>)}
            </select>
        </fieldset>
    )

}


