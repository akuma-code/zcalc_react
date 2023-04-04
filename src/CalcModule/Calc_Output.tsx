import React, { useEffect } from 'react'
import { CalcFormDataExport } from './Calc_Form'
import { useGlassCalculator } from '../hooks/useGlassCalculator'
import { IProfileSystem } from './GlassDelta'

type Props = {
    incomingData: CalcFormDataExport<string>
}

export const CalcOutput = ({ incomingData }: Props) => {
    const { h, w, system, top, bot, left, right } = incomingData

    const keys = Object.keys(incomingData)
    const vals = keys.map(k => incomingData[k as keyof typeof incomingData])


    // const { gw, gh } = useGlassCalculator({ w: +w, h: +h }, system as IProfileSystem, { top, bot, left, right })
    return (
        <div className=' mx-4 min-w-[30vw] flex'>
            <ol className='m-2 border-2 border-black min-w-[15vw]'>
                <b>Входные данные:</b>
                {
                    vals.map((v, i) =>
                        <li key={i}
                            className='flex flex-row justify-between'
                        >
                            <span>{keys[i].toLocaleUpperCase()}:</span>
                            <b>{v}</b>
                        </li>
                    )
                }
            </ol>
            <ol className='m-2 border-2 border-black min-w-[15vw] flex flex-col'>
                <b>Выходные данные:</b>
                <b>Стекло:</b>
                <li><span> Ширина: { }</span></li>
                <li><span>Высота: { }</span></li>
            </ol>

        </div>
    )
}