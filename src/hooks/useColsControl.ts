import { useState } from 'react'
import { IFrameRow } from '../Types/ModelsTypes'
import { useUtils } from './useUtils'


const genID = useUtils.stringID


export function useGridControl(initGrid: IFrameRow[]) {
    const initGridRow = () => ({
        row_id: genID(),
        cols: 1,
    })
    const [grid, setGrid] = useState<IFrameRow[] | []>(initGrid || [initGridRow()])

    const add = (row_id: string) => setGrid(prev => prev.map(g => g.row_id === row_id && g.cols < 4 ? { ...g, cols: g.cols + 1 } : g))
    const rem = (row_id: string) => setGrid(prev => prev.map(g => g.row_id === row_id && g.cols > 1 ? { ...g, cols: g.cols - 1 } : g))
    const rowUp = () => {
        if (grid.length <= 2) setGrid(prev => [initGridRow(), ...prev])
    }
    const rowDown = (id?: string) => {
        if (id && grid.length > 1) return setGrid(prev => prev.filter((r) => r.row_id !== id))
        if (!id && grid.length > 1) return setGrid(prev => prev.filter((r, idx) => idx !== 0))

    }

    const frameControls = { add, rem, rowUp, rowDown }



    return [grid, frameControls] as const
}

