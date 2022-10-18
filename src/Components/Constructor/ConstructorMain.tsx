import React from 'react'
import { ConstRama } from './ConstRama'

interface Props { }

const ConstructorMain = (props: Props) => {
    return (
        <div className='flex-col text-center'>
            <b className="text-4xl">Конструктор</b>
            <div className='divide-x-4 columns-2 flex mt-3'>
                <div className='bg-orange-400 flex flex-col divide-y'>
                    <h3 className='text-2xl'>Control Buttons</h3>
                    <button className='bg-gray-600'>ADD Rama</button>
                    <button className='bg-gray-600'>Remove Rama</button>
                </div>
                <div className='bg-red-500 max-h-96 items-center flex flex-col'>
                    <span className='text-2xl'>
                        Constructror Layout
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ConstructorMain