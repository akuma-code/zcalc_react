import { useUtils } from "../hooks/useUtils";
const _ID = useUtils.stringID
class DataNode {
    id: string
    row_id: string
    constructor(row_id = _ID(), id = _ID()) {
        this.row_id = row_id
        this.id = id
    }
}

class DataRow {
    row_id: string
    cols: number
    constructor(cols = 1, row_id = _ID()) {
        this.row_id = row_id
        this.cols = cols
    }
    get rows() {
        const row = []
        for (let i = 0; i <= this.cols; i++) {
            row.push(new DataNode(this.row_id))
        }
        return row
    }
}

class DataFrame {
    frame_id: string
    rows: typeof DataRow
    constructor(rows: typeof DataRow, frame_id = _ID()) {
        this.frame_id = frame_id
        this.rows = rows
    }

    get newrow() {
        return [new DataRow()]
    }
}

