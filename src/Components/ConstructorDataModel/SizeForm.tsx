import React, { useState, useRef } from 'react';
import { useDataModelContext } from '../../Context/DataModelContext';

import { EDMC_ACTION } from './Store/Interfaces/DM_ConstructorActions';
import { Size } from '../../Models/CalcModels/Size';
export type SizeFormProps = {
    // getData?: (data: { width: number, height: number }) => void
    isHidden?: boolean
    getNewSize: (new_size: Size) => void
    onClose?: () => void
}
export const SizeForm = ({ onClose, getNewSize }: SizeFormProps) => {
    const [inputData, setInputData] = useState({ width: "250", height: "200" });
    const inputW = useRef<HTMLInputElement | null>(null);
    const inputH = useRef<HTMLInputElement | null>(null);
    const { DMC_Action } = useDataModelContext()
    const formRef = useRef(null)

    function submitFn(event: React.FormEvent) {
        event.preventDefault();
        if (!inputW.current || !inputH.current)
            return;

        const new_size = new Size(+inputW.current.value, +inputH.current.value);
        getNewSize(new_size);
        onClose && onClose();

    }

    return (
        <form id='create_form' onSubmit={submitFn} className={'w-full   '} ref={formRef}>
            <fieldset
                className='flex flex-col gap-4 px-2  border-2 border-slate-800 p-4 justify-items-start'
                form='create_form'>
                <legend className='px-2  text-lg'>Create Model Form</legend>

                <input type="text" ref={inputW} placeholder='Width' formTarget='create_form' name='width'
                    value={inputData.width}
                    onChange={e => setInputData(prev => ({ ...prev, width: e.target.value }))} />
                <input type="text" ref={inputH} placeholder='Height' formTarget='create_form' name='height'
                    value={inputData.height}
                    onChange={e => setInputData(prev => ({ ...prev, height: e.target.value }))} />
                <div>
                    <button
                        type='submit'
                        formTarget='create_form'
                        className='border-2 border-green-900 p-1 w-full bg-green-400 rounded-lg active:bg-blue-800 active:text-slate-400'
                    >Accept
                    </button>
                </div>
            </fieldset>
        </form>
    );
};

