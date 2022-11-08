import React, { useState, useEffect, useContext, HTMLAttributes, FC, useMemo, useCallback } from 'react'
import { HookNode } from '../Models/WinFrameHookModel'
import { IRowListItem, IHOOK_Node } from '../Types/ModelsTypes'
import { useUtils } from './useUtils'


const CONVERT = (nodes: IHOOK_Node[]): IRowListItem[] => {
    const lvls = Array.from(new Set(nodes.map(n => n.row_lvl)).values())
    const filterNodes = (lvl: number) => [...nodes].filter(n => n.row_lvl === lvl)
    const converted = lvls.map((lvl, idx) =>
        ({ row_lvl: idx, row_nodes: filterNodes(lvl), row_id: useUtils.stringID() }))
    const row_Ids = [...converted].map(row => ({ ...row, row_id: row.row_id, row_lvl: row.row_lvl }))




    console.log('converted', row_Ids)
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

type IGridRow = { row_id: string, row_lvl: number, cols: number }
interface HasRows extends IGridRow { }

export function useGridModel(nodes: IHOOK_Node[]) {
    const [nodeList, setNodeList] = useState<IRowListItem[] | []>([])


    const list = useMemo(() => CONVERT(nodes), [nodes])
    const [grid, setGrid] = useState<HasRows[]>([])
    const getGrid = (rows_list: typeof list) => {
        const res = rows_list.map(item => ({ row_id: item.row_id, row_lvl: item.row_lvl, cols: item.row_nodes.length }))
        return res
    }

    useEffect(() => {
        setNodeList(list)
        setGrid(getGrid(list))
    }, [list])
    console.log('nodeList', nodeList)
    console.log('grid', grid)
    return [nodeList, grid]
}

const initRowNodes = [
    {
        id: '1',
        row_lvl: 0
    },
    {
        id: '2',
        row_lvl: 0
    },
    {
        id: '3',
        row_lvl: 1
    },
]

const initList = [
    {
        row_lvl: 0,
        row_nodes: [{
            id: '1',
            row_lvl: 0
        },
        {
            id: '2',
            row_lvl: 0
        },]
    },
    {
        row_lvl: 1,
        row_nodes: [{
            id: '3',
            row_lvl: 1
        },]
    }
]