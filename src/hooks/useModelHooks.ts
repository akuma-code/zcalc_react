import React, { useState, useEffect, useContext, HTMLAttributes, FC, useMemo, useCallback } from 'react'
import { HookNode } from '../Models/WinFrameHookModel'
import { IListItem, IHOOK_Node } from '../Types/ModelsTypes'
import { useUtils } from './useUtils'


const CONVERT = (nodes: IHOOK_Node[]): IListItem[] => {
    const lvls = Array.from(new Set(nodes.map(n => n.row_lvl)).values())
    const filterNodes = (lvl: number) => [...nodes].filter(n => n.row_lvl === lvl)
    const converted = lvls.map((lvl, idx) => ({ row_lvl: idx, row_nodes: filterNodes(lvl), row_id: useUtils.stringID(), id: useUtils.stringID() }))
        .sort((a, b) => b.row_lvl - a.row_lvl)
    return converted
}


export const useNodeList = (nodes: IHOOK_Node[]) => {
    const [nodeList, setNodeList] = useState<IListItem[] | []>([])

    const list = useMemo(() => CONVERT(nodes), [nodes])

    useEffect(() => {
        setNodeList([...list])

    }, [list])

    return nodeList
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