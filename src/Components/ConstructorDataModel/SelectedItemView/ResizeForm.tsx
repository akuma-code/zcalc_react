import React, { useRef } from 'react';
import { Size } from '../../../Models/CalcModels/Size';

type ResizeFormProps = {
    initsize: Size;
    getNewSize: (size: Size) => void;
    onClose: () => void;
};
export const ResizeForm = ({ initsize, getNewSize, onClose }: ResizeFormProps) => {

    const { w, h, } = initsize;
    const wRef = useRef<HTMLInputElement>(null);
    const hRef = useRef<HTMLInputElement>(null);
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!wRef.current || !hRef.current)
            return;

        const new_size = new Size(+wRef.current.value, +hRef.current.value);
        getNewSize(new_size);
        onClose();
    };

    return <form name='resize_form' id='resize_form' className='flex gap-4 flex-col' onSubmit={onSubmit}>
        <div className='flex gap-4'>

            <fieldset className='p-2 border-2 border-black max-w-[1em]'>
                <legend>
                    ширина
                </legend>
                <input type="text"
                    className='focus:ring-2 focus:ring-zinc-800 ring-offset-2 max-w-[5em] text-center'
                    ref={wRef}
                    defaultValue={w} />
            </fieldset>
            <fieldset className='p-2 border-2 border-black max-w-fit'>
                <legend>
                    высота
                </legend>
                <input type="text"
                    className='focus:ring-2 focus:ring-zinc-800 ring-offset-2 max-w-[5em] text-center'
                    ref={hRef}
                    defaultValue={h} />
            </fieldset>
        </div>
        <button type='submit' className='ring-1 ring-offset-2 rounded-md px-2 bg-zinc-800 text-slate-50 border-white border-2'>Accept</button>
    </form>;
};
