import { useUtils } from "../hooks/useUtils";
const _ID = useUtils.stringID
export class DataNode {
    id?: string
    row_id: string
    constructor(row_id = _ID(), id = _ID()) {
        this.row_id = row_id
        this.id = id
    }
}

export class DataRow {
    row_id: string
    col: number

    constructor(col = 1, row_id = _ID()) {
        this.row_id = row_id
        this.col = col
    }


    get nodes() {
        const nodesrow = []
        for (let i = 0; i < this.col; i++) {
            nodesrow.push(new DataNode(this.row_id))
        }
        return nodesrow
    }


}

export class DataFrame {
    id: string
    rows: DataRow['nodes']
    constructor(rows: DataRow['nodes'], frame_id = _ID()) {
        this.id = frame_id
        this.rows = rows
    }


}

export class DataVFrameSet {
    id: string
    frames?: DataFrame[]
    constructor(frames: DataFrame[], vf_id = _ID()) {
        this.id = vf_id
        this.frames = frames
    }
}
