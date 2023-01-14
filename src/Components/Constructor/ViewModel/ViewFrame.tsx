/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHookContext } from '../../../Context/HookModelCTX';
import { useGridControl } from '../../../hooks/useColsControl';
import { DataFrame, DataRow } from '../../../Models/DataModel';
import { IFrameRow } from '../../../Types/ModelsTypes';
import { IFrame, IFrameType, IHFramesSet, IVFrameProps, IVFrameSet } from '../../../Types/ViewmodelTypes';
import { IcChange, IcFrameRight, IcFrameUp, IcMinus, IcPlus, IcRowDown, IcRowUp, IcTrash } from '../../Icons/IconsPack';
import ButtonFr from './UI/ButtonFr';
import { VMRow } from './VMRow';


//*****************!   Vertical FramesStack    *********/
export const Frame = ({ onClickFn, data, isSelected }: IVFrameProps) => {
    const frame_id = data!.id
    const [FRAME, FrameControl] = useGridControl(data!.rows);
    const { editInfo: current, setVM, setInfo: setCurrent, setExport, ViewModel } = useHookContext();
    const DelSelFrame = setVM.RemFrame(current.selectedFrameSet);
    const [ft, setFt] = useState<IFrameType>('win');

    const select = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        onClickFn && onClickFn(id);

        if (e.ctrlKey)
            return setCurrent((c: typeof current) => (current.isEditing ? {
                ...c,
                selectedFrame: "",
                selectedFrameSet: "",
                isEditing: false
            }
                : c));
    };
    const rws = (frame: typeof FRAME) => frame.map(f => ({ row_id: f.row_id, frame_id }))
    const vfData = (frame: IFrame) => ({ Rows: data!.rows.map(r => r.row_id), Nodes: frame.rows.map(row => new DataRow(row.col, row.row_id).nodes) })
    useEffect(() => {
        setVM.syncFrames(frame_id, FRAME);
        setExport(get_vm_data(ViewModel))
        const [loger] = ViewModel.VFSets.map(vf => vf.frames.map(vfData))
        console.log('loger', loger)
        // if (ViewModel.VFSets.length === 0) return setExport({})
    }, [FRAME, ft]);


    const VStackControlButtons = useMemo(() => (
        <div className={`top-2  flex justify-around z-22 border-t-2 border-b-2 border-black`}>
            <button className='border-2 bg-[#078747] p-1 m-1 rounded-md border-[black]'
                onClick={() => setVM.AddViewFrameTop(current.selectedFrameSet)}
            >
                <IcFrameUp hw={8} />
            </button>
            <button className='top-1 border-2 bg-[#df1111] p-1 m-1 rounded-md border-[black]'
                onClick={() => DelSelFrame(current.selectedFrame)}
            >
                <IcTrash hw={6} />
            </button>
            <button className='border-2 bg-[#078747] p-1 m-1 rounded-md border-[black]'
                onClick={() => setVM.AddViewFrameRight()}

            >
                <IcFrameRight hw={8} />
            </button>


        </div>

    ), [current.selectedFrame, current.selectedFrameSet]);

    const RowButtonStack = useMemo(() => <div className={`absolute top-2 right-0 flex flex-col z-20 p-1 max-w-[4em] `}>
        <button className='border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black] ring-2 ring-slate-900 ring-offset-2'
            onClick={() => FrameControl.rowUp()}
        >
            <IcRowUp hw={5} />
        </button>
        {FRAME.length > 1 &&
            <button className='border-2 bg-[#2165f8] p-1 m-1 rounded-md border-[black] ring-2 ring-slate-900 ring-offset-2'
                onClick={() => FrameControl.rowDown()}
            >
                <IcRowDown hw={5} />
            </button>}
    </div>,
        [FRAME]);


    const FrameControlButtons = useMemo(() =>
        <div className={`absolute bottom-16 right-1 flex flex-col z-20 p-1 max-w-[4em] `}>
            <button className='bg-amber-800 rounded-md p-1 ring-2 ring-slate-900 ring-offset-2'
                onClick={() => setFt(prev => prev === 'door' ? 'win' : 'door')}>
                <IcChange hw={6} />

            </button>
        </div>,
        [ft]);



    const RowNodes = useCallback(({ col, row_id }: IFrameRow, idx: number) => {
        const isFram = idx === 0 && FRAME.length === 2;

        return <VMRow
            data={{ col, row_id }}
            props={{ fs_id: frame_id, isSelected, frameType: ft, isFram }}
            FrameFN={FrameControl}
            key={row_id}
        />
    }
        , [ft, frame_id, FrameControl]);



    return (

        <div className='relative border border-[#000] flex flex-col bg-slate-700'
            onClick={(e) => select(e, frame_id)}
        >
            {FRAME.map(
                RowNodes
            )}

            {isSelected && [
                VStackControlButtons,
                RowButtonStack,
                FrameControlButtons
            ]}
        </div>

    );
};


const vm = {
    "id": "f4a9",
    "title": "new_bc9f",
    "VFSets": [
        {
            "isSelected": true,
            "id": "02a8",
            "frames": [
                {
                    "id": "9d24",
                    "rows": [
                        {
                            "row_id": "e2e6",
                            "col": 1
                        }
                    ]
                },
                {
                    "id": "f9d0",
                    "rows": [
                        {
                            "row_id": "4546",
                            "col": 2
                        },
                        {
                            "row_id": "6d0b",
                            "col": 3
                        }
                    ]
                }
            ]
        }
    ]
}
const vset = {
    "isSelected": true,
    "id": "02a8",
    "frames": [
        {
            "id": "9d24",
            "rows": [
                {
                    "row_id": "e2e6",
                    "col": 1
                }
            ]
        },
        {
            "id": "f9d0",
            "rows": [
                {
                    "row_id": "4546",
                    "col": 2
                },
                {
                    "row_id": "6d0b",
                    "col": 3
                }
            ]
        }
    ]
}
const get_vset_data = (Vset: IVFrameSet) => {
    const frames = Vset.frames.map(
        vs => ({
            vs_id: Vset.id, frame_id: vs.id, rows: vs.rows.map(
                r => ({
                    row_id: r.row_id, frame_id: vs.id
                }))
        }))

    return { frames }
}
const get_vm_data = (vmodel: IHFramesSet) => {
    const { VFSets } = vmodel
    const [fr_rws] = VFSets.map(get_vset_data)
    return fr_rws
}

