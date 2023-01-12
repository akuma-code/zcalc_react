import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHookContext } from '../../../Context/HookModelCTX';
import { useGridControl } from '../../../hooks/useColsControl';
import { DataRow } from '../../../Models/DataModel';
import { IFrameRow } from '../../../Types/ModelsTypes';
import { IFrameType, IVFrameProps } from '../../../Types/ViewmodelTypes';
import { IcChange, IcFrameRight, IcFrameUp, IcRowDown, IcRowUp, IcTrash } from '../../Icons/IconsPack';
import { VMRow } from './VMRow';


//*****************!   Vertical FramesStack    *********/
export const Frame = (props: IVFrameProps) => {
    const { rows, id: fs_id, onClickFn, isSelected, data } = props;

    const [FRAME, FrameControl] = useGridControl(rows);
    const { editInfo: current, setVM, setInfo: setCurrent } = useHookContext();
    const DelSelFrame = setVM.RemFrame(current.selectedFrameSet);
    const [ft, setFt] = useState<IFrameType>('win');
    const setCols = setVM.changeCols(current.selectedFrame, fs_id);

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
        setVM.syncFrames(fs_id, FRAME);

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


    const FrameControlButtons = useMemo(() => <div className={`absolute bottom-16 right-1 flex flex-col z-20 p-1 max-w-[4em] `}>
        <button className='bg-amber-800 rounded-md p-1 ring-2 ring-slate-900 ring-offset-2'
            onClick={() => setFt(prev => prev === 'door' ? 'win' : 'door')}>
            <IcChange hw={6} />

        </button>
    </div>,
        [ft]);

    // const NodeControlButtonStack = useCallback( (cols: number, row_id: string,) =>
    //     <div className={`absolute p-1 z-22  bottom-1 flex flex-col`}  >
    //         {cols > 1 &&
    //             <button className='bg-[#08629e] p-1  m-1 rounded-md border-[#8a8a8a] ring-2 ring-red-700 ring-offset-1'
    //                 onClick={() => FrameControl.rem(row_id)}
    //             >
    //                 <IcMinus hw={6} />
    //             </button>
    //         }
    //         <button className='bg-[#08629e] p-1  m-1 rounded-md border-[#8a8a8a] ring-2 ring-red-700 ring-offset-1'
    //             onClick={() => FrameControl.add(row_id)}
    //         >
    //             <IcPlus hw={6} />
    //         </button>
    //     </div>
    //     , [FRAME])
    const row_classlist = (cols: number) => [`columns-${cols}`, `gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-t-0 border-b-0 `].join(' ');




    const fram_cond = (idx: number) => idx === 0 && FRAME.length === 2;
    const ROWSS = useCallback((f: IFrameRow, idx: number) => <VMRow
        data={new DataRow(f.col, f.row_id)}
        props={{ fs_id, isSelected, isOnEdit: current.isEditing, frameType: ft, isFram: fram_cond(idx) }}
        addNode={FrameControl.add}
        remNode={FrameControl.rem}
        rowUp={FrameControl.rowUp}
        rowDown={FrameControl.rowDown}
        key={f.row_id} />, [ft, fs_id, FrameControl]);


    // const NODES = useCallback(({ id: string, row_id: string, isFram: boolean, frameType: IFrameType, col: number }) => RF.genNodes(row_id, isFram, frameType)(col), [FRAME])
    // const NodesRow = useCallback((NODES: { row_id: string, isFram: boolean, frameType: IFrameType, col: number, id: string }[]) => {
    //     return RF.List({
    //         items: NODES,
    //         renderItem: (nodeData) => <FNode {...nodeData} key={nodeData.id} />
    //     })
    // }, [props])
    const RowComponent = useCallback((f: IFrameRow, idx: number) => {
        const Props = {
            id: f.row_id,
            row_id: f.row_id,
            isFram: false,
            frameType: 'win'
        };

        return <div className={` ${isSelected || current.isEditing ? 'opacity-100' : '  opacity-50'} relative`}>
            <div className={row_classlist(f.col)}>

            </div>
        </div>;
    }, []);


    return (

        <div className='relative border border-[#000] flex flex-col bg-slate-700'
            onClick={(e) => select(e, fs_id)}
        >
            {FRAME.map(ROWSS)}

            {/* {isSelected && NodeControlButtonStack} */}
            {isSelected && VStackControlButtons}
            {isSelected && RowButtonStack}
            {isSelected && FrameControlButtons}
            {
                // isSelected &&
                // <button onClick={() => setFtype('door')}>
                //     TYPE
                // </button>
            }

        </div>

    );
};
