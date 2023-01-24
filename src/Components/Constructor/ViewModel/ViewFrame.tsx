/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHookContext } from '../../../Context/HookModelCTX';
import { useGridControl } from '../../../hooks/useColsControl';
import { useExportViewModel } from '../../../hooks/useExportViewModel';
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
    const ref = useRef<HTMLDivElement | null>(null)
    const [ft, setFt] = useState<IFrameType>('win');

    const exp = useExportViewModel(ViewModel)



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


    useEffect(() => {
        setVM.syncFrames(frame_id, FRAME, ft);
        // if (!ref.current) return


    }, [FRAME, ft]);


    // useEffect(() => {

    //     setExport(exp)
    //     console.log('exp', exp)
    // }, [])

    const { VStackControlButtons, RowButtonStack, FrameControlButtons } = useMemo(() => {
        const VStackControlButtons =
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

        const RowButtonStack =
            <div className={`absolute top-2 right-0 flex flex-col z-20 p-1 max-w-[4em] `}>
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
            </div>


        const FrameControlButtons =
            <div className={`absolute bottom-16 right-1 flex flex-col z-20 p-1 max-w-[4em] `}>
                <button className='bg-amber-800 rounded-md p-1 ring-2 ring-slate-900 ring-offset-2'
                    onClick={() => setFt(prev => prev === 'door' ? 'win' : 'door')}>
                    <IcChange hw={6} />

                </button>
            </div>

        return { VStackControlButtons, RowButtonStack, FrameControlButtons }

    }, [current, FRAME, ft])

    const RowNodes = useCallback(({ col, row_id }: IFrameRow, idx: number) => {
        const isFram = idx === 0 && FRAME.length === 2;
        const row = { col, row_id, fs_id: frame_id, isSelected, frameType: ft, isFram }
        return row
        // return <VMRow
        //     data={{ col, row_id }}
        //     props={{ fs_id: frame_id, isSelected, frameType: ft, isFram }}
        //     FrameFN={FrameControl}
        //     key={row_id}
        // />
    }
        , [ft, frame_id]);



    return (
        <>
            <div className='relative border border-[#000] flex flex-col bg-slate-700'
                onClick={(e) => select(e, frame_id)} ref={ref}
            >
                {FRAME.map((f, idx) =>
                    // RowNodes
                    <VMRow
                        data={{ ...RowNodes(f, idx) }}
                        props={{ ...RowNodes(f, idx) }}
                        FrameFN={FrameControl}
                        key={f.row_id}
                    />
                )}

                {isSelected && [
                    VStackControlButtons,
                    RowButtonStack,
                    FrameControlButtons
                ]}
            </div>
        </>

    );
};

