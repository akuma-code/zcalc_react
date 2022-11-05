import { useUtils } from "../hooks/useUtils"
import { StrNum } from "../Types/FrameTypes"

const ID = useUtils.generateID

interface IWFModel {
    id: StrNum
    wf_rows?: {
        id?: StrNum
        wf_parts?: {
            id: StrNum
            row_id?: StrNum
        }[] | []
    }[]
}

export class WinFrameModel {
    model: IWFModel

    constructor(model: IWFModel) {
        this.model = model
        this.AddRow()
    }

    AddRow() {
        const row_id = ID()
        const newpart = {
            id: ID(),
            row_id
        }
        const newrow = {
            id: row_id,
            wf_parts: [newpart]
        }
        if (!this.model.wf_rows) this.model.wf_rows = []
        this.model.wf_rows.push(newrow)
        const rows = this.model.wf_rows
        console.log('rows', rows)
        return rows
    }
    RemRow(id: StrNum) {
        const rows = this.model.wf_rows!.filter(row => row.id !== id)
        console.log('removed rows', rows)
        return rows
    }

    AddPart(row_id: StrNum) {
        const newpart = {
            id: ID(),
            row_id
        }
        this.model.wf_rows!.map(row => row.id === row_id ? [row.wf_parts, newpart] : row)
        const [row] = this.model.wf_rows!.filter(row => row.id === row_id)
        console.log('row->add part', row)
        return row
    }

    RemPart(row_id: StrNum) {
        const [row] = this.model.wf_rows!.filter(row => row.id === row_id)
        row.wf_parts!.splice(0, 1)
        console.log('row->rem part', row)
        return row
    }

}



