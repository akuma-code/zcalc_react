import React, { useState, useRef } from 'react'
import { DataModelContext } from '../../Context/DataModelContext'
import { ModalCreate } from '../CmConstructor/ModalCreate'
import { ColoredButton } from '../CmConstructor/ColoredButton'

type ConstructorProps = {}

export const DMConstructorLayout = (props: ConstructorProps) => {
    return (
        <DataModelContext.Provider value={{ info: 'Not ready yet' }}>

            <div className='bg-slate-200 w-full h-full p-1 flex flex-col'>
                <div className='flex w-full h-[8em] bg-green-200'>
                    <ModalCreate title='Новая конструкция' >
                        <CreateForm getData={(data) => console.log("size: ", data)} />
                        {/* <ColoredButton onClickFn={() => { }} label='Создать' bgColor='blue-400' /> */}
                        {/* <ColoredButton onClickFn={() => { }} label='Удалить модель' bgColor='blue-400' /> */}

                    </ModalCreate>
                </div>



                <div className='flex w-full h-fit'>
                    <div className='bg-blue-300 w-[20em] h-[75vh]'>SelectedItemLayout</div>
                    <div className='bg-blue-400 w-full'>CanvasLayout</div>
                </div>
            </div>

        </DataModelContext.Provider>
    )
}

type CreateFormProps = {
    getData: (data: { width: number, height: number }) => void
}
const CreateForm = ({ getData }: CreateFormProps) => {
    const [data, setData] = useState({ width: 0, height: 0 })
    const inputW = useRef<HTMLInputElement | null>(null)
    const inputH = useRef<HTMLInputElement | null>(null)
    function submitFn(event: React.FormEvent) {
        event.preventDefault()
        getData(data)
        // setData(prev => ({ ...prev, width: 0, height: 0 }))

    }

    function handleChange(key: keyof typeof data, value: number) {
        setData(prev => ({ ...prev, [key]: value }))
    }
    return (
        <form id='create_form' onSubmit={submitFn} >
            <div className='flex gap-4 px-2'>

                <input onChange={(e) => handleChange('width', +e.target.value)}
                    type="text"
                    placeholder='Width'
                    formTarget='create_form'
                    ref={inputW}
                    defaultValue=""
                />
                <input onChange={(e) => handleChange('height', +e.target.value)}
                    type="text"
                    placeholder='Height'
                    formTarget='create_form'
                    ref={inputH}
                    defaultValue=""
                />
                <button type='submit' formTarget='create_form'
                    className='border-2 border-black active:bg-blue-800 p-1'
                >Accept</button>
            </div>
        </form>
    )
}