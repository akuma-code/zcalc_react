import React, { useState, useEffect, useContext, HTMLAttributes, FC } from 'react'
import { CNode } from '../Models/WinFrameHookModel'
import { IGrid } from '../Types/ModelsTypes'
import { useUtils } from './useUtils'

type IRowID = { row_id: string }

interface IColsItem extends IRowID { }

const CN_Array = (len: number, id: string) => {
    const arr = [] as any
    while (len > 0) {

        arr.push(new CNode(id))
        len--
    }

    return arr
}

export const MakeNodes = (row_id: string, cols: number): CNode[] => {
    const arr = CN_Array(cols, row_id)
    return arr
}
const genID = useUtils.stringID

const initGridRow = {
    row_id: genID(),
    cols: 1,
    row_lvl: 0
}
export function useGridControl(initGrid: IGrid[]) {
    const [grid, setGrid] = useState<IGrid[] | []>(initGrid || [initGridRow])
    const add = (row_id: string) => setGrid(prev => prev.map(g => g.row_id === row_id ? { ...g, cols: g.cols + 1 } : g))
    const rem = (row_id: string) => setGrid(prev => prev.map(g => g.row_id === row_id ? { ...g, cols: g.cols - 1 } : g))
    const rowUp = () => setGrid(prev => [{ ...prev, row_id: genID(), cols: 1, row_lvl: prev.length + 1 }])
    const rowDown = (row_id: string) => setGrid(prev => prev.filter(r => r.row_id !== row_id))

    const gridContol = { add, rem, rowUp, rowDown }
    useEffect(() => {
        // const gridNodes = grid.map(g => ({ row_id: g.row_id, row_lvl: g.row_lvl, row_nodes: MakeNodes(g.row_id, g.cols), cols: g.cols }))
        setGrid(initGrid)
    }, [initGrid])


    return [grid, gridContol] as const
}


