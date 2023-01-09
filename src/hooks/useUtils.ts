import { v4 } from "uuid"
import { IGridConstProps } from "../Components/Constructor/FramesSet"
import { IConstructGrid, IWinFrame, IWinFramePart, IWinFrameRow } from "../Types/FrameTypes"
import { IFrameRow } from "../Types/ModelsTypes"

export const useUtils = {
    generateID: (type?: string, length = 4) => {
        if (type === 'num') return parseInt(v4().slice(0, 6), 16)
        else return v4().slice(0, length)
    },


    stringID: () => v4().slice(0, 4),


    frame2grid: (frame: IWinFrame) => {
        const cNumb = (parts: IWinFramePart[]) => parts.length
        const grid: IConstructGrid[] = []
        frame.wf_rows.forEach(r => {
            if (!r.wf_parts || !r.id) return
            grid.push({ row: r.id, cols: cNumb(r.wf_parts) })
        })
        return grid
    },
    getRows: (frame: IWinFrame) => {
        const rows = frame.wf_rows

        return rows
    },
    groupParts: (rows: IWinFrameRow[]) => {
        const rNumb = rows.length
        const rowsArray = []
        //пробегаемся по рядам, получаем количество столбцов из длинны отфильтрованного массива
        for (let r = 1; r <= rNumb; r++) {
            const getRows = (row: number) => rows[r - 1].wf_parts?.filter(f => f.row_id === row) || []

            const ROWS = getRows(r)

            rowsArray.push(...ROWS)
        }
        console.log('partsArr', rowsArray)
        return rowsArray
    }
}




export function extract_data(obj: object) {

    const ex_O = (o: any) => Object.entries(o).map(([k, v]) => (
        `${k}: ${v}`
    ))
    const toStr = ([key, value]: [string, any]) => {
        if (typeof value != `string`) ex_O(value)
        return `${key}: ${value}`
    }
    const [elements] = Object.entries(obj)
    elements.map(toStr)
    return toStr(elements)

}


export function ObjToStr(obj: any) {
    return JSON.stringify(obj, null, 2)
}

export function GridRowEncode(grid: IFrameRow[]) {
    const gridCols = grid.map(r => (`${r.cols}`)).join('')
    // const rowsIDS = grid.map(r => (`${r.row_id}`)).join('-')
    // console.log('encoded: ', gridCols, rowsIDS)
    return gridCols
}
export function ConstEncode(framebox: IGridConstProps[]) {
    const CompareString = framebox.map(frame => GridRowEncode(frame.rows)).join('-')
    // console.log('ConCompNumber: ', CompareString)
    return CompareString
}


const test_construction = [
    {
        "id": "2cdc",
        "rows": [
            {
                "row_id": "de48",
                "cols": 1
            },
            {
                "row_id": "3824",
                "cols": 3
            }
        ]
    },
    {
        "id": "2fea",
        "rows": [
            {
                "row_id": "1081",
                "cols": 3
            },
            {
                "row_id": "fe7d",
                "cols": 4
            },
            {
                "row_id": "7496",
                "cols": 3
            }
        ]
    }
]
ConstEncode(test_construction)