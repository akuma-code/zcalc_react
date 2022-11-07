import { FrameNode } from "../Models/WinFrameModel"
import { StrNum } from "./FrameTypes"


export type IFrameNode = FrameNode
export interface IWFModel {
    id: string
    wf_rows?: {
        id: string
        wf_parts?: {
            id: string
            row_id?: string
        }[]
        lvl?: number
    }[]
}

export interface IWFModel_2 {
    id: string
    rows: {
        id: string
        lvl: number
    }[]
    nodes?: IFrameNode[]
}