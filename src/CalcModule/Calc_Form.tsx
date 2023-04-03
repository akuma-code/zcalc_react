import React, { ChangeEvent, SelectHTMLAttributes, useRef, useState } from 'react'
import GlassDelta, { IProfileSystem, ISideState } from './GlassDelta'
import { ISide, ISize } from '../Types/FrameTypes'
import { CM_Node, Const2Desc } from '../Types/CalcModuleTypes'

type Props = {}

export const CalcForm = (props: Props) => {
    const [SYSTEM, SetSYSTEM] = useState<IProfileSystem>('Proline')
    const sys = useRef<HTMLSelectElement | null>(null)
    const submitFn = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!sys.current) return
        const s = sys.current.value as IProfileSystem
        SetSYSTEM(prev => s)
        // console.log('system', sys.current.value)
    }

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
                    <input type="number" placeholder='Width' />
                    <input type="number" placeholder='Height' />
                    <button type="submit" className='bg-slate-600' formTarget='fff'>Submit</button>
                </div>
                <div className="flex flex-col gap-4">


                    <SideSelect system={SYSTEM} side='top' changeFn={(e) => console.log('top: ', e.target.value)} />
                    <SideSelect system={SYSTEM} side='bot' changeFn={(e) => console.log('bot: ', e.target.value)} />
                    <SideSelect system={SYSTEM} side='left' changeFn={(e) => console.log('left: ', e.target.value)} />
                    <SideSelect system={SYSTEM} side='right' changeFn={(e) => console.log('right: ', e.target.value)} />


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
type AllowedSideState = ISideState[IProfileSystem]
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