import React, { useState, useEffect, useContext, HTMLAttributes, FC, useMemo, useCallback } from 'react'
import { HookNode } from '../Models/WinFrameHookModel'
import { IRowListItem, IHOOK_Node } from '../Types/ModelsTypes'
import { useUtils } from './useUtils'


const CONVERT = (nodes: IHOOK_Node[]) => {
    const lvls = Array.from(new Set(nodes.map(n => n.row_lvl)).values())
    const row_id = useUtils.stringID()
    const converted = lvls.map((lvl) => {
        const filterNodes = (lvl: number) => [...nodes].filter(n => n.row_lvl === lvl)

        return { row_lvl: lvl, row_nodes: filterNodes(lvl), row_id }
    })
    // const row_Ids = [...converted].map(row => ({ ...row, row_id: row.row_id, row_lvl: row.row_lvl }))

    return converted.sort((a, b) => b.row_lvl - a.row_lvl)
}


export const useNodeList = (nodes: IHOOK_Node[]) => {
    const [nodeList, setNodeList] = useState<IRowListItem[] | []>([])


    const list = useMemo(() => CONVERT(nodes), [nodes])



    useEffect(() => {
        setNodeList(list)
    }, [list])

    return nodeList
}

type IGridRow = { id?: string, row_id?: string, row_lvl: number, cols: number }
interface HasRows extends IGridRow { }

export function useGridModel(nodes: IHOOK_Node[]) {
    const [nodeList, setNodeList] = useState<IRowListItem[] | []>([])
    const [grid, setGrid] = useState<HasRows[]>([])

    const list = useMemo(() => CONVERT(nodes), [nodes])

    const getGrid = (rows_list: typeof list) => {
        const res = [...rows_list].map(item => ({ ...item, id: item.row_id, row_id: item.row_id, row_lvl: item.row_lvl, cols: item.row_nodes.length }))
        return res
    }

    useEffect(() => {
        setGrid(getGrid(list))
        setNodeList(list)
    }, [list])

    return [nodeList, grid] as const
}


