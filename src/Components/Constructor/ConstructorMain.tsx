import React, { useState, HTMLAttributes, useEffect, useMemo } from 'react'
import { ConstructorContext } from '../../Context/ConstructCTX'
import { extract_data, ObjToStr, useUtils } from '../../hooks/useUtils'
import { WinFrameModel, WinFrameModel_3 } from '../../Models/WinFrameModel'
import { IConstructGrid, IWinFrame, IWinFramePart, IWinFrameRow } from '../../Types/FrameTypes'
import { IModelFrame } from '../../Types/ModelsTypes'
import Button from '../UI/Button'
import { ModelFrameElem } from './Model_3_FrameElem'
import { WFModelItem } from './WFModelItem'
import { WinFrame } from './Win_frame'



const genID = useUtils.generateID().toString
type ConstructorProps = {
    children?: React.ReactNode
} & HTMLAttributes<HTMLDivElement>




export const ConstructorMain: React.FC<ConstructorProps> = () => {

    const [frames, setFrames] = useState<IWinFrame[] | []>([])
    const [wfModels, setWfModels] = useState<WinFrameModel_3[] | []>([])
    const [models3, setModels3] = useState<WinFrameModel_3[] | []>([])
    const [models, setModels] = useState<IModelFrame[] | []>([])
    const [current, setCurrent] = useState<IWinFrame | {}>({})
    const [parts, setParts] = useState<IWinFramePart[] | []>([])
    const [grid, setGrid] = useState<[] | IConstructGrid[]>([])
    const [savedFrames, setSavedFrames] = useState<[] | IWinFrame[]>([])
    const [rows, setRows] = useState<[] | IWinFrameRow[]>([])

    const NEW_MODEL = () => {

    }
    const ADD_MODEL2 = () => {
        const WFmodel = new WinFrameModel_3()
        setWfModels((prev: any) => [...prev, WFmodel])
        console.log(WFmodel);
    }



    const ClickOnModel = (e: React.MouseEvent<HTMLElement>, model_id: string) => {
        const [mod] = wfModels.filter(m => m.frame.id === model_id)
        if (e.altKey === true) return mod.remRow()
        return mod.addRow(1)
    }
    const AddFrame = () => {
        const nF = {
            id: genID(),
            wf_rows: [
                {
                    wf_parts: [
                        { part_id: genID(), row_id: 1 }]
                }]
        }
        setFrames((prev: any) => [...prev, nF])
    }
    const RemoveFrame = (frame_id?: string) => {
        if (!frame_id) return
        setFrames(prev => prev.filter(f => f.id !== frame_id))
    }

    const SaveFrames = () => setSavedFrames(frames)
    useEffect(() => {
        const mdls = wfModels.map(m => m.frame)
        setModels(mdls)


    }, [wfModels])
    // const memoElem = useMemo(() => {
    //     return wfModels.map(m => (<WFmodelElement
    //         model={m}
    //         key={m.frame.id}
    //         onClick={(e) => ClickOnModel(e, m.frame.id)}
    //     />

    //     ))
    // }, [wfModels])
    return (
        <ConstructorContext.Provider value={{
            frames, setFrames,
            grid, setGrid,
            savedFrames, setSavedFrames,
            parts, setParts,
            rows, setRows,
            current, setCurrent,
            wfModels, setWfModels,
        }}>

            <div className='flex-col text-center'>
                <b className="text-4xl">Конструктор</b>
                <div className='divide-x-4 columns-2 flex mt-3'>

                    <div className='bg-orange-800 flex flex-col divide-y px-2'>
                        <h3 className='text-2xl'>Control Panel</h3>
                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={ADD_MODEL2}
                            disabled={wfModels.length > 1}
                        >Добавить раму
                        </button>
                        <Button bg='#11b434'
                            onClickFn={SaveFrames}
                        >
                            Сохранить
                        </Button>
                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                            onClick={() => setFrames([])}
                        >Очистить конструктор
                        </button>
                        <button
                            className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black
                            disabled:bg-slate-200"
                            onClick={ADD_MODEL2}
                            disabled={wfModels.length > 1}
                        >ADD MODEL
                        </button>

                    </div>
                    <div className='bg-orange-800 divide-y-2'>
                        <span className='text-2xl p-1 m-1'>
                            CanvasLayout
                        </span>
                        <Canvas>
                            {
                                // frames.map((f, idx) => (
                                //     <WinFrame key={idx} wf_rows={f.wf_rows} id={f.id} remove={RemoveFrame} onClickFn={() => setCurrent(f)} />
                                // ))
                            }

                            {/* 
                                wfModels && wfModels.map(m => (
                                    <WFModelItem
                                        key={m.frame.id}
                                        model={m}
                                    />
                                ))

                             */}
                            {wfModels.map(model => (
                                <ModelFrameElem model={model} key={model.frame.id} />
                            ))}
                        </Canvas>
                    </div>
                </div>
            </div>
        </ConstructorContext.Provider>
    )
}


const Canvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className='bg-red-500 max-h-96 items-center flex flex-col min-h-[30em]  min-w-[20em] px-4 py-2'>

            {children}
        </div>
    )
}
