import React, { useCallback } from 'react';
import { _ID } from '../Constructor/ViewModel/ViewModelConst';
import { DivBlock } from './FramesLibrary';

type CodePreviewCardProps = {
    frameCode: string;
};



export const CodePreviewCard: React.FC<CodePreviewCardProps> = ({ frameCode }) => {


    const FrameRowEncode = (code = '21') => {
        const rows = code.split('');
        function getBlocks(colsStr = '1') {
            let cols = parseInt(colsStr);
            const blocks = [] as any[];
            while (cols > 0) {
                blocks.push(<DivBlock key={_ID()} />);
                cols--;
            }
            return blocks;
        }

        const RowWrapper = (cols: number) => `grid grid-cols-${cols}  gap-3   p-3`;


        return (
            <div className='border-[black] border-2 flex flex-col-reverse' key={_ID()}>
                {rows.map((cols, idx) => (
                    <div className={RowWrapper(+cols)} key={_ID()}>
                        {getBlocks(cols)}
                    </div>
                ))}
            </div>
        );
    };

    const FrameEncode = (code = '21-1') => {
        const framesNumbs = code.split('-');
        const frElems = framesNumbs.map(FrameRowEncode);

        return (
            <div className='flex flex-col-reverse'>
                {frElems}
            </div>
        );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const MemoFramesEncoded = useCallback(() => FrameEncode(frameCode), [frameCode]);


    return (
        <div className='container flex-column bg-slate-500 m-1 w-fit h-fit p-1'>
            <div className='m-2  bg-white border-black '>
                {MemoFramesEncoded()}
            </div>
            <div className='p-1 text-[white]'>FrameCode: {frameCode}</div>

        </div>
    );
};
