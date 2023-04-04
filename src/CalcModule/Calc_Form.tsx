import React, { ChangeEvent, SelectHTMLAttributes, useEffect, useRef, useState } from 'react'
import GlassDelta, { IProfileSystem, ISideState } from './GlassDelta'
import { ISide, ISize } from '../Types/FrameTypes'
import { CM_Node, Const2Desc, INodeState } from '../Types/CalcModuleTypes'

type Props = {
    getFormData: (data: typeof initData) => void
}
const initData: CalcFormDataExport<string> = {
    system: 'Proline',
    state: 'fix',
    nodeType: 'win',
    top: 'rama',
    bot: 'rama',
    left: 'rama',
    right: 'rama',
    w: '0',
    h: '0',
}
export type CalcFormDataExport<T extends string> = {
    system: IProfileSystem | T,
    state: INodeState | T,
    nodeType: 'win' | 'door' | 'shtulp' | T,
    top: ISideState[IProfileSystem] | T,
    bot: ISideState[IProfileSystem] | T,
    left: ISideState[IProfileSystem] | T,
    right: ISideState[IProfileSystem] | T,
    w: T
    h: T
}


export const CalcForm: React.FC<Props> = (props) => {
    const [SYSTEM, SetSYSTEM] = useState<IProfileSystem>('Proline')
    const [data, setData] = useState(initData)
    const sys = useRef<HTMLSelectElement | null>(null)


    const submitFn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!sys.current) return
        const s = sys.current.value as IProfileSystem
        SetSYSTEM(prev => s)
        setData(prev => ({ ...prev, system: s }))
        console.log('data', data)
        props.getFormData(data)
        return data as CalcFormDataExport<string>
        // console.log('system', sys.current.value)
    }
    useEffect(() => {
        props.getFormData(initData)
    }, [])
    return (
        <form id='fff' onSubmit={submitFn}>


            <div className='flex flex-row gap-4'>
                <div className="flex flex-col gap-4">

                    <select name="system" ref={sys} defaultValue={'Proline'}>
                        <option value={'Proline'}>Proline</option>
                        <option value={'Softline'}>Softline</option>
                        <option value={'WHS60'}>WHS60</option>
                        <option value={'WHS72'}>WHS72</option>
                    </select>
                    <select name="state" defaultValue={'fix'} onChange={(e) => setData(prev => ({ ...prev, state: e.target.value }))}>
                        <option value={'fix'}>FIX</option>
                        <option value={'stv'}>STV</option>
                        <option value={'shtulp'}>SHTULP</option>
                    </select>
                    <select name="nodeType" defaultValue={'win'} onChange={(e) => setData(prev => ({ ...prev, nodeType: e.target.value }))}>
                        <option value={'win'}>WIN</option>
                        <option value={'door'}>DOOR</option>
                    </select>
                    <input type="number" placeholder='Width' onChange={(e) => setData(prev => ({ ...prev, w: e.target.value }))} defaultValue={0} />
                    <input type="number" placeholder='Height' onChange={(e) => setData(prev => ({ ...prev, h: e.target.value }))} defaultValue={0} />
                    <button type="submit" className='bg-slate-600' formTarget='fff'>Submit</button>
                </div>
                <div className="flex flex-col gap-4">


                    <SideSelect system={SYSTEM} side='top' changeFn={(e) => setData(prev => ({ ...prev, top: e.target.value }))} />
                    <SideSelect system={SYSTEM} side='bot' changeFn={(e) => setData(prev => ({ ...prev, bot: e.target.value }))} />
                    <SideSelect system={SYSTEM} side='left' changeFn={(e) => setData(prev => ({ ...prev, left: e.target.value }))} />
                    <SideSelect system={SYSTEM} side='right' changeFn={(e) => setData(prev => ({ ...prev, right: e.target.value }))} />


                </div>
            </div>
        </form>
    )
}
type SideSelectProps = {
    system: IProfileSystem
    side: ISide
    changeFn: (e: React.ChangeEvent<HTMLSelectElement>) => void
}


const SideSelect: React.FC<SideSelectProps> = ({ system, side, changeFn }) => {
    const sel = useRef<null | HTMLSelectElement>(null)
    const options = Object.keys(GlassDelta[system]) as ISideState[typeof system][]

    return (
        <fieldset className='border-black border-solid border-2 p-1'>
            <legend >{side.toUpperCase()}</legend>

            <select className='mx-1' ref={sel} defaultValue={options[0]} onChange={changeFn} >
                {options.map((o, ind) =>
                    o && <option value={o} key={ind}>{Const2Desc(o)}</option>)}
            </select>
        </fieldset>
    )

}