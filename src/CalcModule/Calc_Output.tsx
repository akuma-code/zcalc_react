import { useEffect, useMemo, useState } from 'react'
import { useGlassCalculator } from '../hooks/useGlassCalculator'
import { CalcFormBorderExport } from '../Types/CalcModuleTypes'
import { useExtractObjectFields } from '../hooks/useExtractObjectFields'
import { PROFILE } from '../Types/Enums'
import { useNodeBorders } from '../hooks/useNodeBorders'
import { CModel_v1Service } from '../Models/CalcModels/CalcModelControl'
import { CalcModel } from '../Models/CalcModels/CalcModel.v1'
import { CalcNode_v2 } from '../Models/CalcModels/CalcNode.v2'
import { CNodeService as CNS } from "../Models/CalcModels/CNodeService"
import { CalcNode } from '../Models/CalcModels/CalcNode'
type Props = {
    incomingData: CalcFormBorderExport
}

export const CalcOutput = ({ incomingData }: Props) => {
    const [show, setShow] = useState({ delta: false, borders: true })
    const [nodesPool, setPool] = useState<CalcModel['nodes'] | []>([] as CalcModel['nodes'])
    const [model, setModel] = useState<CalcModel | {}>({} as CalcModel)
    const { system, borders, w, h } = incomingData
    const { delta, updateDelta, Borders, dwdh } = useNodeBorders(borders)
    const glass = useGlassCalculator({ w: +w, h: + h }, dwdh)
    const createFn = () => {
        const size = { w: +w, h: +h }
        const newFix = CModel_v1Service.createModel(system, size)
        setModel(prev => newFix)


    }
    const splitFn = () => {
        if (!model) return

    }
    const AddToPool = () => { }
    const ClearPool = () => setPool(prev => [])

    useEffect(() => {
        updateDelta(system)

    }, [system, borders])
    return (
        <div className=' mx-4 min-w-[fit] flex'>
            <div className='flex flex-col'>
                Controls
                {Btn('Create New', createFn)}
                {Btn('Split', splitFn)}
                {Btn('Clear', ClearPool)}

                <label >
                    <input type="checkbox" checked={show.delta} onChange={() => setShow(prev => ({ ...prev, delta: !prev.delta }))} />
                    Show delta
                </label>
                <label >
                    <input type="checkbox" checked={show.borders} onChange={() => setShow(prev => ({ ...prev, borders: !prev.borders }))} />
                    Show borders
                </label>
            </div>
            {
                incomingData && show.delta &&

                <OutputList data_object={delta} label={'дельта ' + PROFILE[system] || 'Proline'} />
            }
            {
                show.borders &&

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
            }
        </div>
    )
}

const Btn = (label: string, cb: (...args: any) => void, props?: any) => {
    return (
        <button type='button' className={`
        px-2 m-1
      bg-slate-800 
      text-pink-200
      active:text-red-800
      disabled:bg-opacity-50
           `}
            {...props}
            onClick={cb}
        >
            {label}
        </button>)
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