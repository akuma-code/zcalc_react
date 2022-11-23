import React from "react";
import { useUtils } from "../hooks/useUtils";
import { IGridRow, IHook_Model, IHOOK_Node, IRowListItem } from "../Types/ModelsTypes";

const ID = useUtils.stringID

export class HookNode {
    id: string
    row_lvl: number
    row_id?: string
    constructor(lvl = 0, row_id: string = "") {
        this.id = ID()
        this.row_lvl = lvl
        this.row_id = row_id
    }
}

export class CNode {
    id: string
    row_id: string
    // renderNode:(node:CNode)=>React.ReactNode
    constructor(row_id: string) {
        this.row_id = row_id
        this.id = ID()
    }


}


export class ConstructionModel {
    id: string
    grid: IGridRow[]
    nodes: CNode[]

    constructor() {
        this.id = useUtils.stringID()
        this.grid = []
        this.nodes = []
        // this.init()
    }
    // init() {
    //     const id = useUtils.stringID()
    //     this.grid = [{ row_id: id, cols: 1 }]
    //     this.nodes = [new CNode(id)]
    //     return
    // }
}

export class HookModel implements IHook_Model {
    id: string
    nodes: IHOOK_Node[]
    node_list?: {
        id: string
        grid: { row_lvl: number, row_id: string, cols: number },
        row_nodes: { id: string, row_id: string, row_lvl: number }[]
    }[]
    // grid: { row_lvl: number, row_id: string, cols: number }[]
    // NList: IRowListItem[]
    constructor(nodes?: IHOOK_Node[]) {
        this.id = ID()
        this.nodes = []
        this.node_list = []
        // nodes && this.nodes.push(nodes)
        this.init(nodes)
    }


    init(nodes?: IHOOK_Node[]) {
        const init_row_id = ID()
        const init_row_lvl = 0
        const init_Node = new HookNode(init_row_lvl, init_row_id)
        this.nodes?.push(init_Node)
        this.node_list = this.NodeList(nodes)
        // this.node_list = this.NodeList(nodes)

        // this.grid = [{ row_lvl: 0, row_id: init_row_id, cols: 1 }]
        // this.grid = this.getGrid(this.nodes)

    }

    public NodeList(nodes = this.nodes) {
        const row_lvls = Array.from(new Set(nodes.map(n => n.row_lvl)).values())
        const filterNodes = (row_lvl: number) => [...nodes].filter(n => n.row_lvl === row_lvl)
        const ROWNODES = row_lvls.map(LVL => {
            const row_id = useUtils.stringID()
            const row_nodes = filterNodes(LVL).map(node => ({ ...node, row_id }))
            const grid = { row_lvl: LVL, row_id, cols: row_nodes.length }
            return { grid, row_nodes, id: row_id }
        })
        return ROWNODES
    }

    getGrid(nodes = this.nodes) {
        const Conv = this.NodeList(nodes)
        return [...Conv].map(node => ({ row_id: node.grid.row_id, row_lvl: node.grid.row_lvl, cols: node.row_nodes.length }))
    }


}