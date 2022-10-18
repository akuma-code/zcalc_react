import React from 'react'
import { IFrameConstruct } from '../../Types/FrameTypes';

interface ConstRamaProps {
    children?: React.ReactNode
    frames?: IFrameConstruct[]
}



const testrama = {
    frames: [
        { row: 1, posNumb: 1 },
        { row: 1, posNumb: 2 },
        { row: 1, posNumb: 3 },
        { row: 2, posNumb: 4 },
        // { row: 2, posNumb: 5 },
        // { row: 2, posNumb: 6 },
    ]
}

function getRC(frames: { row: number, posNumb: number }[]) {
    const RC = [];
    // получаем кол-во рядов
    const rowsNumber = Math.max(...frames.map(f => f.row))
    //достаем номер позиции и ряды
    const extractPos = (frames: { row: number, posNumb: number }[]) => frames.map(f => ({ posNumb: f.posNumb }))
    const getRows = (row: number) => frames.filter(f => f.row === row)
    //пробегаемся по рядам, получаем количество столбцов из длинны отфильтрованного массива
    for (let r = 1; r <= rowsNumber; r++) {

        const ROWS = getRows(r)

        RC.push({ row: r, cols: ROWS.length, frames: extractPos(ROWS) })
    }

    return RC
}

const RowRama: React.FC<{ cols: number, children?: React.ReactNode }> = ({ cols, children }): JSX.Element => (
    <div className={`gap-x-6 columns-${cols} bg-[#2e2e2e] p-5 border-2 border-[#fff]`}>{children}</div>)

const RowFrame: React.FC<{ posNumb: number }> = (frame) => (
    <div className='flex h-[10em] min-w-[5em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]'>{frame.posNumb}</div>
)

const RowFrameMin: React.FC<{ posNumb: number }> = (frame) => (
    <div className='flex h-[5em] min-w-[5em] border-4 border-double bg-[#3ddd07] hover:bg-[#124402]'>{frame.posNumb}</div>
)



export const ConstRama: React.FC<ConstRamaProps> = ({ frames }) => {

    const cls_rama = "flex flex-col-reverse w-fit"
    if (!frames) return (
        <div className={cls_rama}>
            <RowRama cols={1} >
                <RowFrame posNumb={1} />
            </RowRama>
        </div>)
    const RC = getRC(frames)
    // Если рядов всего 2
    if (RC.length === 2) {
        return (
            <div className={cls_rama}>
                {
                    RC.map((row, idx) => (
                        <RowRama cols={row.cols} key={idx} >
                            {row.row === 1 ? row.frames.map(f =>
                                <RowFrame posNumb={f.posNumb} key={f.posNumb} />)
                                :
                                row.frames.map(f =>
                                    <RowFrameMin posNumb={f.posNumb} key={f.posNumb} />)
                            }
                        </RowRama>
                    ))
                }
            </div>
        )
    }


    return (
        <div className={cls_rama}>
            {
                RC.map((row, idx) => (
                    <RowRama cols={row.cols} key={idx} >
                        {row.frames.map(f =>
                            <RowFrame posNumb={f.posNumb} key={f.posNumb} />)}
                    </RowRama>
                ))
            }
        </div>
    )
}