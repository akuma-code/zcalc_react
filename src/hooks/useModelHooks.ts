import React, { useState, useEffect, useContext, HTMLAttributes, FC, useMemo, useCallback } from 'react'
export type IHOOK_Node = {
    id: string
    row_lvl: number
    row_id?: string
}
export type IHOOK_ListItem = {
    row_lvl: number
    row_nodes: IHOOK_Node[]
}
const initNodes = [
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

const CONVERT = (nodes: IHOOK_Node[]): IHOOK_ListItem[] => {
    const lvls = Array.from(new Set(nodes.map(n => n.row_lvl)).values())
    const filterNodes = (lvl: number) => [...nodes].filter(n => n.row_lvl === lvl)
    const converted = lvls.map(lvl => ({ row_lvl: lvl, row_nodes: filterNodes(lvl) }))
    return converted
}
export const useNodeList = (nodes: IHOOK_Node[]) => {
    const [nodeList, setNodeList] = useState<IHOOK_ListItem[] | []>([])
    const list = useMemo(() => CONVERT(nodes), [nodes])

    const add = (lvl: number = 0) => setNodeList(prev => prev.map(n => n.row_lvl === lvl ? n.row_nodes.push({ row_lvl: lvl }) : n))


    useEffect(() => {
        setNodeList([...list])
        console.log('list', list)
    }, [list])

    // setNodeList(list)
    return [nodeList]
}


