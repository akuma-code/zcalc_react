import { useUtils } from "../hooks/useUtils"
import { v4 } from "uuid"
import { IFrameNode, IFrameRowNodes, IModelFrame, IModelFrame_3, IWFModel_2 } from "../Types/ModelsTypes"
import { HTMLAttributes } from 'react'
const ID = useUtils.generateID



export class WinFrameModel {
    frame: IModelFrame
    constructor(model: IModelFrame) {
        this.frame = model
        if (!this.frame.wf_rows) {
            this.frame.wf_rows = []
            this.AddRow()
        }
        console.log('grid', this.grid)
    }

    AddRow() {
        const row_id = ID().toString()

        const newpart = new FrameNode({ row_id })
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

        const newpart = new FrameNode({ row_id })
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
    row_idx: number = 0
    constructor(node?: { row_id?: string, row_idx?: number }) {
        this.id = this.getId()
        if (node?.row_id) this.row_id = node.row_id
        if (node?.row_idx) this.row_idx = node.row_idx
        console.log(this);
    }

    getId() {
        return v4().slice(0, 4)
    }
    // public get element() {

    //     const Node: React.FC<{ node: IFrameNode } & HTMLAttributes<HTMLDivElement>> = ({ node = this }): JSX.Element => {
    //         return (
    //             <div className={`flex h-[10em] min-w-[3em] border-8 border-double border-black bg-[#0f66ad] `} >{node.id}</div>)
    //     }
    //     return (<Node node={this} key={this.id} />)
    // }

}

export class WinFrameModel_3 {
    frame: IModelFrame_3

    constructor(model?: IModelFrame_3) {

        this.frame = model || this.initFrameModel()
        this.frame.rows_list = this.rows_list
        // this.frame.rows = []

        console.log('IWFModel_3', this)
    }

    initFrameModel() {
        const newrow = {
            id: ID().toString(),

        }
        const initModel = {
            id: ID().toString(),
            nodes: [new FrameNode({ row_id: newrow.id })],
            rows: [newrow]
        } as IModelFrame_3

        return initModel
    }

    addNode(lvl: number = 0) {
        const row_id = this.frame.rows[lvl]?.id
        this.frame.nodes.push(new FrameNode({ row_idx: lvl, row_id }))

    }
    remNode(lvl: number = 0) {
        this.frame.nodes.splice(lvl, 1)
        return this
    }

    addRow(lvl: number = this.frame.rows_list.length + 1) {
        this.addNode(lvl)
        return this
    }

    remRow(lvl: number = this.frame.rows.length - 1) {
        return this.frame.nodes?.filter(n => n.row_id !== this.frame.rows[lvl].id)
    }

    clearRowNodes(lvl: number) {
    }

    get rows_list() {
        const nodes = this.frame.nodes
        const rows_list: IFrameRowNodes[] = []
        const lvls = Math.max(...nodes.map(n => n.row_idx))
        for (let i = 0; i <= lvls; i++) {
            rows_list.push([...nodes].filter(n => n.row_idx === i))
        }
        return rows_list
    }

}




// export class WinFrameModel_2 {
//     frame: IWFModel_2
//     constructor(model?: IWFModel_2) {
//         this.frame = model || this.initFrameModel()
//         this.frame.rows = this.rows_list
//         // this.frame.nodes = []
//         console.log('IWFModel_2', this)
//     }

//     initFrameModel() {
//         const newrow = {
//             id: ID().toString(),
//             row_idx: 0
//         }
//         const initModel = {
//             id: ID(),
//             rows: [[newrow]],
//             nodes: [new FrameNode(newrow.id)]
//         } as IWFModel_2

//         return initModel
//     }

//     addNode(lvl: number = 0) {
//         const [row] = this.frame.rows[lvl]
//         this.frame.nodes?.push(new FrameNode(row.id))
//         return this
//     }
//     remNode(node_id?: string, lvl?: number) {
//         const [row] = this.frame.rows[lvl || 0]
//         if (node_id) return this.frame.nodes?.filter(node => node.id !== node_id)
//         if (lvl) return this.frame.nodes?.filter(n => n.row_id === row.id).splice(lvl || 0, 1)
//         // return this.frame.rows.splice(lvl || 0, 1)
//     }

//     addRow(lvl: number = this.frame.rows.length + 1) {
//         const row = {
//             id: ID().toString(),
//             row_idx: lvl,
//         }
//         this.frame.nodes?.push(new FrameNode(row.id))
//         this.frame.rows.push(row)
//         return this.frame.rows

//     }

//     remRow(lvl: number = this.frame.rows.length - 1) {
//         const row_id = this.frame.rows[lvl].id
//         this.clearRowNodes(lvl)
//         return this.frame.rows.filter(r => r.id !== row_id)
//     }

//     clearRowNodes(lvl: number) {
//         return this.frame.nodes?.filter(n => n.id !== this.frame.rows[lvl].id)
//     }

//     get rows_list() {
//         const nodes = this.frame.nodes
//         const rows_list: { id: string, row_idx: number, row_id: string }[][] = []
//         nodes && nodes.forEach(node => {
//             rows_list[node.row_idx].push(node)
//         })
//         return rows_list
//     }

// }