import { useUtils } from "../hooks/useUtils"
import { v4 } from "uuid"
import { IFrameNode, IWFModel, IWFModel_2 } from "../Types/ModelsTypes"
import { HTMLAttributes } from 'react'
const ID = useUtils.generateID



export class WinFrameModel {
    frame: IWFModel
    constructor(model: IWFModel) {
        this.frame = model
        if (!this.frame.wf_rows) {
            this.frame.wf_rows = []
            this.AddRow()
        }
        console.log('grid', this.grid)
    }

    AddRow() {
        const row_id = ID().toString()
        // const newpart = {
        //     id: ID().toString(),
        //     row_id,
        //     lvl: this.frame.wf_rows!.length
        // }
        const newpart = new FrameNode(row_id)
        const newrow = {
            id: row_id,
            wf_parts: [newpart],
            lvl: this.frame.wf_rows!.length
        }
        this.frame.wf_rows!.push(newrow)
        const rows = this.frame.wf_rows
        console.log('addrow: ', rows)
        return this.frame
    }
    RemRow(row_id?: string) {
        if (!row_id) return this.frame.wf_rows!.splice(-1, 1)
        const rows = this.frame.wf_rows!.filter(row => row.id !== row_id)
        console.log('removed row: ', rows)
        return this.frame
    }

    AddPart(row_id: string) {
        // const newpart = {
        //     id: ID().toString(),
        //     row_id
        // }
        const newpart = new FrameNode(row_id)
        const [row] = this.frame.wf_rows!.filter(row => row.id === row_id)
        if (!row.wf_parts) row.wf_parts = []
        row.wf_parts?.push(newpart)
        console.log('row->add part', row)
        return this.frame
    }

    RemPart(row_id: string) {
        const [row] = this.frame.wf_rows!.filter(row => row.id === row_id)
        row.wf_parts!.splice(0, 1)
        console.log('row->rem part', row)
        return this.frame
    }

    get grid() {
        const lvls = this.frame.wf_rows?.map(row => ({ lvl: row.lvl, pCount: row.wf_parts?.length || 0, parts: row.wf_parts })) || []
        console.log('lvls', lvls)
        return lvls
    }

}



export class FrameNode {
    id: string
    row_id?: string
    constructor(row_id?: string) {
        this.id = this.getId()
        if (row_id) this.row_id = row_id
        console.log(this);
    }

    getId() {
        return v4().slice(0, 4)
    }
    public get element() {

        const Node: React.FC<{ node: IFrameNode } & HTMLAttributes<HTMLDivElement>> = ({ node = this }): JSX.Element => {
            return (
                <div className={`flex h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] `} >{node.id}</div>)
        }
        return (<Node node={this} key={this.id} />)
    }

}

export class WinFrameModel_2 {
    frame: IWFModel_2
    constructor(model?: IWFModel_2) {
        this.frame = model || this.initFrameModel()
        // this.frame.rows = []
        // this.frame.nodes = []
        console.log('IWFModel_2', this)
    }

    initFrameModel() {
        const newrow = {
            id: ID().toString(),
            lvl: 0
        }
        const initModel = {
            id: ID(),
            rows: [newrow],
            nodes: [new FrameNode(newrow.id)]
        } as IWFModel_2

        return initModel
    }

    addNode(lvl: number = 0) {
        const row = this.frame.rows[lvl]
        this.frame.nodes?.push(new FrameNode(row.id))
        return this
    }
    remNode(node_id?: string, lvl?: number) {
        const row = this.frame.rows[lvl || 0]
        if (node_id) return this.frame.nodes?.filter(node => node.id !== node_id)
        if (lvl) return this.frame.nodes?.filter(n => n.row_id === row.id).splice(lvl || 0, 1)
        // return this.frame.rows.splice(lvl || 0, 1)
    }

    addRow(lvl: number = this.frame.rows.length + 1) {
        const row = {
            id: ID().toString(),
            lvl: lvl
        }
        this.frame.nodes?.push(new FrameNode(row.id))
        this.frame.rows.push(row)
        return this.frame.rows

    }

    remRow(lvl: number = this.frame.rows.length - 1) {
        const row_id = this.frame.rows[lvl].id
        this.clearRowNodes(lvl)
        return this.frame.rows.filter(r => r.id !== row_id)
    }

    clearRowNodes(lvl: number) {
        return this.frame.nodes?.filter(n => n.id !== this.frame.rows[lvl].id)
    }

}

