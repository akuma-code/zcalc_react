import React, { useState } from 'react'

type Props = {}

export const CalcForm = (props: Props) => {
    const [fv, setFv] = useState({ system: "", size: { w: 0, h: 0 } })
    const submitFn = (e: React.FormEvent) => {
        e.preventDefault()

        console.log('e', e)
    }

    return (
        <form id='fff' onSubmit={submitFn}>


            <div className='flex flex-row gap-4'>
                <div className="flex flex-col gap-4">

                    <select name="system" >
                        <option value={'Proline'}>Proline</option>
                        <option value={'Softline'}>Softline</option>
                        <option value={'WHS60'}>WHS60</option>
                        <option value={'WHS72'}>WHS72</option>
                    </select>
                    <input type="number" placeholder='Width' />
                    <input type="number" placeholder='Height' />
                    <button type="submit" className='bg-slate-600' formTarget='fff'>Submit</button>
                </div>
                <div className="flex flex-col gap-4">

                    <label htmlFor="">TOP:
                        <select name="top" placeholder='TOP'>
                            <option value="rama">рама</option>
                            <option value="imp">импост</option>
                            <option value="stv_rama">створка-рама</option>
                            <option value="stv_imp">створка-импост</option>
                        </select>
                    </label>
                    <label htmlFor="">BOT
                        <select name="BOT" placeholder='BOT'>
                            <option value="rama">рама</option>
                            <option value="imp">импост</option>
                            <option value="stv_rama">створка-рама</option>
                            <option value="stv_imp">створка-импост</option>
                        </select>
                    </label>
                    <label htmlFor="">LEFT
                        <select name="Left" placeholder='Left'>
                            <option value="rama">рама</option>
                            <option value="imp">импост</option>
                            <option value="stv_rama">створка-рама</option>
                            <option value="stv_imp">створка-импост</option>
                        </select>
                    </label>
                    <label htmlFor="">RIGHT
                        <select name="Right" placeholder='Right'>
                            <option value="rama">рама</option>
                            <option value="imp">импост</option>
                            <option value="stv_rama">створка-рама</option>
                            <option value="stv_imp">створка-импост</option>
                        </select>
                    </label>



                </div>
            </div>
        </form>
    )
}