import { useState, useEffect } from 'react'

export function useFRC(frames: { row: number, posNumb: number }[]) {
    const grid = [];
    // получаем кол-во рядов
    const rowsNumber = Math.max(...frames.map(f => f.row))

    //достаем номер позиции и ряды
    const getRows = (row: number) => frames.filter(f => f.row === row)
    const extractPos = (frames: { row: number, posNumb: number }[]) => frames.map(f => ({ posNumb: f.posNumb }))
    //пробегаемся по рядам, получаем количество столбцов из длинны отфильтрованного массива
    for (let r = 1; r <= rowsNumber; r++) {

        const ROWS = getRows(r)

        grid.push({ row: r, cols: ROWS.length, row_frames: extractPos(ROWS) })
        // grid.push({ row: r, cols: ROWS.length })
    }

    // const gridFrames = [...frames].map((f, idx) => ({ ...f, posNumb: idx + 1 }))
    console.log(grid);

    return [grid] as const
}


