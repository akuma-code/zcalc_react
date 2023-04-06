import { useEffect, useMemo } from 'react'
import { useGlassCalculator } from '../hooks/useGlassCalculator'
import { CalcFormBorderExport } from '../Types/CalcModuleTypes'
import { useExtractObjectFields } from '../hooks/useExtractObjectFields'
import { PROFILE } from '../Types/Enums'
import { useNodeBorders } from '../hooks/useNodeBorders'
import { ISide } from '../Types/FrameTypes'

type Props = {
    incomingData: CalcFormBorderExport
}

export const CalcOutput = ({ incomingData }: Props) => {
    const { system, borders, w, h } = incomingData
    const { delta, updateDelta, Borders, dwdh } = useNodeBorders(borders)
    const glass = useGlassCalculator({ w: +w, h: + h }, dwdh)

    useEffect(() => {
        updateDelta(system)

    }, [system, borders])
    return (
        <div className=' mx-4 min-w-[30vw] flex'>
            {
                // incomingData &&
                // <OutputList data_object={incomingData} label='Входные данные' />
            }
            {incomingData &&
                <OutputList data_object={delta} label={'дельта ' + PROFILE[system] || 'Proline'} />
            }
            <ol className='m-2 border-2 border-black min-w-[15vw] flex flex-col max-w-fit p-2'>

                {Borders &&
                    Borders.map(b =>
                        <li key={b.side}>
                            [{b.side.toUpperCase()}] {b.desc} : <b>{b.delta}</b>
                        </li>
                    )}
                {dwdh &&
                    <>
                        <li>[DeltaW] <b>{dwdh.dw}</b> </li>
                        <li>[DeltaH] <b>{dwdh.dh}</b></li>
                    </>
                }
                {glass &&
                    <>
                        <li>[Glass W]: <b>{glass.gw}</b> </li>
                        <li>[Glass H]: <b>{glass.gh}</b> </li>
                    </>
                }
            </ol>
        </div>
    )
}
interface OutputListProps<O extends Object> {
    data_object: O extends Array<O> ? never : O
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
        <ol className='m-2 p-2 border-2 border-black min-w-[15vw] flex flex-col max-w-max'>
            <b>{data.label.toLocaleUpperCase()}</b>
            {listContent}
        </ol>
    )
}