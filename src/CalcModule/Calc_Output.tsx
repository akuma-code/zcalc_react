import React, { useEffect, useMemo, useState } from 'react'
import { CalcFormDataExport } from './Calc_Form'
import { getValue, useDelta, useGlassCalculator } from '../hooks/useGlassCalculator'
import GlassDelta, { IProfileSystem } from './GlassDelta'
import { ISideStateValues, ISides2, ISidesArray, PickAviable } from '../Types/CalcModuleTypes'
import { useExtractObjectFields } from '../hooks/useExtractObjectFields'
import { PROFILE } from '../Types/Enums'

type Props = {
    incomingData: CalcFormDataExport<string>
}

export const CalcOutput = ({ incomingData }: Props) => {

    const delta = useDelta(GlassDelta, incomingData.system)
    const { system } = incomingData
    const arr: ISidesArray<typeof system> = [
        { side: 'bot', state: incomingData.bot as PickAviable<ISideStateValues, typeof system> },
        { side: 'top', state: incomingData.top as PickAviable<ISideStateValues, typeof system> },
        { side: 'left', state: incomingData.left as PickAviable<ISideStateValues, typeof system> },
        { side: 'right', state: incomingData.right as PickAviable<ISideStateValues, typeof system> },
    ]
    const mapped = arr.map(item => ({ ...item, state: delta.values[item.state] }))
    console.log('mapped', mapped)
    return (
        <div className=' mx-4 min-w-[30vw] flex'>
            {
                incomingData &&
                <OutputList data_object={incomingData} label='Входные данные' />
            }
            {incomingData &&
                <OutputList data_object={delta.values} label={'дельта ' + PROFILE[system] || 'Proline'} />
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