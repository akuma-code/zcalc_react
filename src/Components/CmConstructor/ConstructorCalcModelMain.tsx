import React, { useState, useRef, HTMLAttributes, useEffect, useReducer } from 'react'
import { ModelView } from './ModelView'
import { CalcModel_v2 } from '../../Models/CalcModels/CalcModel.v2'
import { Size } from '../../Models/CalcModels/Size'
import { DataModelView } from './DataModelView'
import { ConstructorReducer, initConstructorData } from './store/reducers/ConstructorReducer'
import { IDataModel } from '../../Types/DataModelTypes'
import { Constructor_Actions_Types } from './store/ReducerTypes'
import { _ID } from '../Constructor/ViewModel/ViewModelConst'
import { ISideStateValues, ISides } from '../../Types/CalcModuleTypes'
import { BorderDescEnum } from '../../Types/Enums'
import { DataNode } from '../../Models/DataModel'
import { ColoredButton } from './ColoredButton'
import { ModalCreate } from './ModalCreate'

type ConstructorMainProps = {

}

const init = (data: typeof initConstructorData) => data



const ConstructorMainCalcModel = (props: ConstructorMainProps) => {
    const [constr_data, action] = useReducer(ConstructorReducer, initConstructorData, init)


    const [cmodel, setCmodel] = useState<CalcModel_v2 | null>()
    const [size, setSize] = useState({ w: 0, h: 0 })

    const scaleRef = useRef(null)
    const sizeRef = useRef(null)
    const getsize = (w: number, h: number) => { setSize(prev => ({ ...prev, w, h })) }

    const onCreateClick = () => {
        onSubmitSize(size)
        const { w, h } = size
        const newModel = new CalcModel_v2(w, h)
        if (w && h) setCmodel(prev => {
            if (!prev) return newModel
            return prev.changeSize({ w, h })
            // return prev = { ...prev } as CalcModel_v2
        })
        const newDataModel: IDataModel = {
            id: _ID(),
            nodes: [],
            size,
            coords: [0, 0, w, h],
            params: { system: 'Proline', type: 'win' },

        }
        action({ type: Constructor_Actions_Types.ADD_MODEL, payload: { size: { w, h }, coords: [0, 0, w, h] } })
        // action({ type: Constructor_Actions_Types.SUBMIT, payload: newDataModel })
    }
    const onDeleteClick = () => { setCmodel(prev => null) }
    const onScaleChange = (value: number) => {
        // setSize(prev => ({ ...prev, h: prev.h * value, w: prev.w * value }))
        scaleRef.current && console.log(scaleRef.current);
        console.log("scale: ", value);

    }
    const onSubmitSize = (sizes: Size) => {
        action({ type: Constructor_Actions_Types.CHANGE_INPUT, payload: { field: 'size', value: sizes } })
        setSize(prev => ({ ...prev, ...sizes }))
        console.log('size', size)
    }

    return (
        <div className=' border-4 border-double border-pink-500 p-4 flex-col'>
            <div className='flex'>

                <div className='flex-col gap-4 '>
                    <div className='flex gap-4 h-fit'>

                        <ModalCreate title='modal' >
                            <SizeInput getSize={getsize} ref={sizeRef} onSubmit={onSubmitSize} />

                            <ColoredButton onClickFn={onCreateClick} label='Создать модель' bgColor='blue-400' />
                            <ColoredButton onClickFn={onDeleteClick} label='Удалить модель' bgColor='blue-400' />

                        </ModalCreate>
                    </div>
                    {/* <div className='flex gap-2 mt-2'>
                        {prevState.map((s, idx) =>
                            <div className='flex gap-2 bg-green-300 rounded-lg p-1 border-2 border-black cursor-pointer'
                                onClick={() => onPrevClick(s)}
                                key={idx}
                            >{s.w} : {s.h}</div>
                        )}
                    </div> */}
                </div>
                <div>
                    {constr_data.data_models.map(m =>
                        <DataModelView data_model={m} key={m.id} />
                    )}
                </div>
            </div>
            <div>
                {/* <ScaleInput changeFn={onScaleChange} ref={scaleRef} /> */}
            </div>
        </div>
    )
}




type SizeInputProps = {
    getSize: (w: number, h: number) => void
    onSubmit: (size: Size) => void
}
const SizeInput = React.forwardRef((props: SizeInputProps, ref: React.ForwardedRef<HTMLFormElement>) => {
    const [size, setSize] = useState({ w: 0, h: 0 })
    const [prevState, setPrevState] = useState<typeof size[]>([])


    const onChangeSize = (field: keyof typeof size, value: string) => {
        setSize(prev => ({ ...prev, [field]: +value }));
    }


    const onPrevClick = (s: Size) => {
        const last = [...prevState].pop()
        // setPrevState(prev => [...prev])
        setSize(prev => ({ ...prev, ...last }))

    }
    const wRef = useRef<HTMLInputElement | null>(null)
    const hRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => {
        props.getSize(size.w, size.h)
    }, [size])
    const onFinish = () => {
        setSize(prev => ({ ...prev, w: +wRef.current!.value, h: +hRef.current!.value }))
        setPrevState(prev => [...prev, size])
        props.onSubmit(size)
    }

    return (
        <form className='flex flex-col gap-2 ' ref={ref} onSubmit={onFinish}>
            <TextInput id='inp_w' label='Width' ref={wRef} onChange={() => onChangeSize('w', wRef.current!.value)} />
            <TextInput id='inp_h' label='Height' ref={hRef} onChange={() => onChangeSize('h', hRef.current!.value)} />
            <div className='flex gap-2 mt-2'>
                {prevState.map((s, idx) =>
                    <div className='flex gap-2 bg-green-300 rounded-lg p-1 border-2 border-black cursor-pointer'
                        onClick={() => onPrevClick(s)}
                        key={idx}
                    >{s.w} : {s.h}</div>
                )}
            </div>
        </form>
    )
})

const TextInput = React.forwardRef((props: HTMLAttributes<HTMLInputElement> & { label: string }, ref: React.ForwardedRef<HTMLInputElement>) => {
    return (
        <div className=''>
            <label htmlFor={props.id} className='flex gap-2 justify-between'>
                {props.label}
                <input ref={ref}  {...props} className='mx-2 w-[3em] text-center' />
            </label>
        </div>
    )
})
type ScaleInputProps = {
    changeFn: (scale: number) => void
}
const ScaleInput = React.forwardRef((props: ScaleInputProps, ref) => {
    const scaleRef = useRef<HTMLInputElement>(null)
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => props.changeFn(+e.target.value)
    return (
        <div className='flex flex-col'>
            <label htmlFor="scale_input">Масштаб х {scaleRef.current && scaleRef.current.value}</label>
            <input type="range" min={0.1} max={2} step={0.1} defaultValue={1} id='scale_input' ref={scaleRef} onChange={onChange} />
        </div>)
})

export default ConstructorMainCalcModel