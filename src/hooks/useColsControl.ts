import React, { useState, useEffect, useContext, HTMLAttributes, FC } from 'react'
import { CNode } from '../Models/WinFrameHookModel'
import { IGridRow } from '../Types/ModelsTypes'
import { useUtils } from './useUtils'

type IRowID = { row_id: string }

interface IColsItem extends IRowID { }



// export const MakeNodes = (row_id: string, cols: number): CNode[] => {
//     const arr = CN_Array(cols, row_id)
//     return arr
// }
const genID = useUtils.stringID

const initGridRow = {
    row_id: genID(),
    cols: 1,

}
export function useGridControl(initGrid: IGridRow[]) {
    const initGridRow = {
        row_id: genID(),
        cols: 1,
    }
    const [grid, setGrid] = useState<IGridRow[] | []>(initGrid || [initGridRow])

    const add = (row_id: string) => setGrid(prev => prev.map(g => g.row_id === row_id && g.cols < 4 ? { ...g, cols: g.cols + 1 } : g))
    const rem = (row_id: string) => setGrid(prev => prev.map(g => g.row_id === row_id && g.cols > 1 ? { ...g, cols: g.cols - 1 } : g))
    const rowUp = () => {
        if (grid.length <= 2) setGrid(prev => [initGridRow, ...prev])
    }
    const rowDown = () => {
        if (grid.length > 1) setGrid(prev => prev.filter((r, idx) => idx !== 0))
    }

    const frameControls = { add, rem, rowUp, rowDown }
    useEffect(() => {
        setGrid(initGrid)
    }, [initGrid])


    return [grid, frameControls] as const
}


const ROWarr = (len: number, row_ID: string) => {
    const arr = [] as { row_id: string }[]
    arr.length = len
    arr.fill({ row_id: row_ID })
    return arr
}
export function FRow(cols: number, rowID?: string) {
    const row_ID = rowID || genID()
    const row = ROWarr(cols, row_ID).map(n => ({ ...n, id: genID() }))
    return row

}


export function useFrameRow(cols: number, rowID?: string) {
    const row_ID = rowID || genID()
    // const [row, setRow] = useState<ReturnType<typeof ROWarr>>([])
    // useEffect(() => {
    //     setRow(ROWarr(cols, row_ID))
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [cols])
    const row = ROWarr(cols, row_ID)


    return row

}

