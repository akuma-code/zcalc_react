import { useUtils } from "../hooks/useUtils"

import { IWFModel } from "../Types/ModelsTypes"

const ID = useUtils.generateID



export class WinFrameModel {
    frame: IWFModel
    constructor(model: IWFModel) {
        this.frame = model
        if (!this.frame.wf_rows) this.frame.wf_rows = []
        this.AddRow()
        console.log('grid', this.grid)
    }

    AddRow() {
        const row_id = ID().toString()
        const newpart = {
            id: ID().toString(),
            row_id,
            lvl: this.frame.wf_rows!.length
        }
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
        const newpart = {
            id: ID().toString(),
            row_id
        }
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



