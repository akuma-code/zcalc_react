import { FrameNode } from "../Models/WinFrameModel"
import { StrNum } from "./FrameTypes"


export type IFrameNode = FrameNode
export type IFrameRowNodes = IFrameNode[]
export interface IModelFrame {
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
        row_idx: number
        row_id: string
    }[]
    nodes?: IFrameNode[]
}

export interface IModelFrame_3 {
    id: string
    nodes: IFrameNode[]
    rows_list: IFrameRowNodes[]
    rows: {
        id: string
    }[]
}

export interface IHook_Model {
    id: string
    nodes: IHOOK_Node[]
    node_list?: {
        id: string
        grid: { row_lvl: number, row_id: string, cols: number },
        row_nodes: { id: string, row_id: string, row_lvl: number }[]
    }[]
    // grid?: { row_id: string, row_lvl: number, cols: number }[]
}

export type IHOOK_Node = {
    id: string
    row_lvl: number
    row_id?: string
}
export type IRowListItem = {
    id?: string
    row_lvl: number
    row_id: string
    row_nodes: IHOOK_Node[]
}
