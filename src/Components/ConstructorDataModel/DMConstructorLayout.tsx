import React, { useState, useRef, HTMLAttributes } from 'react'
import { DataModelContext } from '../../Context/DataModelContext'
import { ModalCreate } from '../CmConstructor/ModalCreate'
import { ColoredButton } from '../CmConstructor/ColoredButton'
import { _log } from '../../hooks/useUtils'

type ConstructorProps = {}
//TODO: States для разных вариантов выбранного элемента, типа рама, импост нода и т.п.
export const DMConstructorLayout = (props: ConstructorProps) => {
    const [newModelForm, setNewModelForm] = useState({ width: 0, height: 0 })
    const [showForm, setShowForm] = useState(false)
    const getFormData = (data: { width: number, height: number }) => {
        setNewModelForm(prev => ({ ...data }))
        setShowForm(false)
    }
    return (
        <DataModelContext.Provider value={{
            info: 'create_form',
            createform_data: newModelForm,

        }}>

            <GridLayout grid={{ cols: 4, rows: 4 }} >

                <GridLayoutItem type='controls' className='flex-col gap-4 flex'>
                    {showForm && <CreateForm getData={getFormData} />}
                    <ColoredButton onClickFn={() => setShowForm(prev => !prev)} label={showForm ? 'Close' : 'Open Form'} />
                </GridLayoutItem>
                <GridLayoutItem type='selected'>
                    {/* <div className='h-[7em]'></div> */}
                </GridLayoutItem>
                <GridLayoutItem type='canvas'>
                    <div className='p-4'>

                        <div className='border-2 h-[25em] w-[32em] bg-red-400 flex p-2  relative  z-0'>
                            <div className="absolute h-12 w-12 bg-lime-500 left-0 top-0  flex justify-center">M</div>
                            <div className="h-full w-full bg-white  p-4 hover:bg-slate-800 hover:text-cyan-50 z-10">
                                <div className="bg-blue-400  h-full hover:bg-slate-800 hover:text-cyan-50 z-20"></div>
                            </div>
                            <div className="h-full w-full bg-white p-4 hover:bg-slate-800 hover:text-cyan-50 z-10">
                                <div className="bg-blue-400  h-full hover:bg-slate-800 hover:text-cyan-50 z-20"></div>
                            </div>
                            <div className="h-full w-full bg-white p-4 hover:bg-slate-800 hover:text-cyan-50 z-10">
                                <div className="bg-blue-400  h-full hover:bg-slate-800 hover:text-cyan-50 z-20"></div>
                            </div>
                        </div>
                    </div>
                </GridLayoutItem>

            </GridLayout>
        </DataModelContext.Provider>
    )
}

type CreateFormProps = {
    getData?: (data: { width: number, height: number }) => void
}
const CreateForm = ({ getData }: CreateFormProps) => {
    const [data, setData] = useState({ width: 0, height: 0 })
    const inputW = useRef<HTMLInputElement | null>(null)
    const inputH = useRef<HTMLInputElement | null>(null)
    function submitFn(event: React.FormEvent) {
        event.preventDefault()
        // getData && getData(data)
        const [w, h] = [inputW.current?.value, inputH.current?.value]
        if (!w || !h) return
        getData && getData({ width: +w!, height: +h! })
        _log("W: ", inputW.current?.value)
        _log("H: ", inputH.current?.value)

    }

    function handleChange(key: keyof typeof data, value: number) {
        setData(prev => ({ ...prev, [key]: value }))
    }
    return (
        <form id='create_form' onSubmit={submitFn} className='w-full  border-2 p-2'>
            <div className='flex flex-col gap-4 px-2 text-center'>
                <div><b>CreateModel Form</b></div>
                <div>
                    <input onChange={(e) => handleChange('width', +e.target.value)}
                        type="text"
                        placeholder='Width'
                        formTarget='create_form'
                        ref={inputW}
                        defaultValue=""
                    />
                </div>
                <div>
                    {/* <input onChange={(e) => handleChange('height', +e.target.value)}
                        type="text"
                        placeholder='Height'
                        formTarget='create_form'
                        ref={inputH}
                        defaultValue=""
                    /> */}
                    <SizeInput ref={inputH} />
                </div>


                <div className='w-fit mx-auto'>
                    <button type='submit' formTarget='create_form'
                        className='border-2 border-black active:bg-blue-800 p-1 w-full'
                    >Accept</button>
                </div>
            </div>
        </form>
    )
}

const SizeInput = React.forwardRef<HTMLInputElement>((props, ref) => {
    return <input type="text" ref={ref} {...props} defaultValue={""} className=' w-full' />

})
type GridLayoutProps = {
    children?: React.ReactNode
    grid?: { cols: number, rows: number }
} & HTMLAttributes<HTMLDivElement>
const GridLayout: React.FC<GridLayoutProps> = ({ grid = { cols: 4, rows: 4 }, children }) => {
    const gridStyle = `grid grid-cols-${grid.cols} grid-rows-${grid.rows}`
    return <div className={`grid grid-cols-4 grid-rows-4 gap-2`}>
        {children}
    </div>
}
type LayoutItemProps = {
    type: 'selected' | 'controls' | 'canvas'
    className?: string
    children?: React.ReactNode
}
const GridLayoutItem: React.FC<LayoutItemProps> = ({ type, className, children, }: LayoutItemProps) => {
    const styletype = {
        selected: ' col-start-2 col-end-5 row-start-1 bg-blue-300 col-span-full ',
        canvas: 'col-start-2 col-end-5 row-start-2 bg-blue-200 row-span-full ',
        controls: 'col-start-1 col-end-2  row-span-full bg-green-300 p-2 ',
    }

    const style = `${styletype[type]} `
    return <div className={style + className}>
        {children}
    </div>
}

const GridControls: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
    return (<GridLayoutItem type='controls'>{children}</GridLayoutItem>)
}
const GridCanvas: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
    return (<GridLayoutItem type='canvas'>{children}</GridLayoutItem>)
}
const GridSelectedControls: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => {
    return (<GridLayoutItem type='selected'>{children}</GridLayoutItem>)
}