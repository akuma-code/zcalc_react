import React, { useEffect, useMemo, useState } from 'react'
import { CalcFormDataExport } from './Calc_Form'
import { useDelta, useGlassCalculator } from '../hooks/useGlassCalculator'
import GlassDelta, { IProfileSystem } from './GlassDelta'
import { ISideStateValues, ISides2 } from '../Types/CalcModuleTypes'
import { useExtractObjectFields } from '../hooks/useExtractObjectFields'
import { ProfileVeka } from '../Types/Enums'

type Props = {
    incomingData: CalcFormDataExport<string>
}

export const CalcOutput = ({ incomingData }: Props) => {
    console.log('incomingData', incomingData)
    const delta = useDelta(GlassDelta, incomingData.system)
    const size = { w: +incomingData.w, h: +incomingData.h }

    const S = incomingData.system
    return (
        <div className=' mx-4 min-w-[30vw] flex'>
            {
                incomingData &&
                <OutputList data_object={incomingData} label='Входные данные' />
            }
            {incomingData &&
                <OutputList data_object={delta} label={'дельта ' + ProfileVeka[S] || 'Proline'} />
            }
        </div>
    )
}
interface OutputListProps<O extends Object> {
    data_object?: O
    label: string
}
export const OutputList = <T extends Object>(data: OutputListProps<T>) => {
    const { data_object } = data
    const output = useExtractObjectFields(data_object!)

    const listContent = useMemo(() => {
        return output.map(o =>
            <li key={o.key}>{o.key}: <b>{o.value}</b></li>
        )
    }, [output])
    if (!data_object) { return <ol><b>No Data</b></ol> }

    return (
        <ol className='m-2 border-2 border-black min-w-[15vw] flex flex-col'>
            <b>{data.label.toLocaleUpperCase()}</b>
            {listContent}
        </ol>
    )
}