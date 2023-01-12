import { DivProps } from "."
import { DataFrame, DataNode, DataRow, DataVFrameSet } from "../Models/DataModel"
import { ConstructionModel } from "../Models/WinFrameHookModel"
import { IFrameRow } from "./ModelsTypes"

export type IGridConstProps = Pick<ConstructionModel, 'rows'> & { id: string, frCode?: string }
export type IFrameType = 'door' | 'win'

export interface IFrame {
    id: string,
    frCode?: string
    rows: { row_id: string, col: number }[],
    data?: DataFrame
    props?: {
        id: string,
        frCode?: string
    }
}
export type IVFrameProps = {
    id: string
    isSelected?: boolean
    props?: {
        id: string
        isSelected?: boolean
    }
    data?: {
        frames: DataVFrameSet
    }
    onClickFn?: (fs_id: string) => void
} & IFrame & DivProps
export interface IHFramesSet {
    VFSets: IVFrameSet[]
    id: string
    title?: string
}

export interface IVFrameSet {
    id: string
    frames: IFrame[]
    title?: string
    isSelected?: boolean
    props?: {
        id: string
        frames: IFrame[]
        title?: string
        isSelected?: boolean
    }
    data?: DataVFrameSet

}
export type ViewModelActions = {
    DeleteViewFrame: (frameset_id: string) => void
    AddViewFrameRight: () => void
    AddViewFrameTop: (frameset_id: string) => void
    RemLastViewFrameTop: (frameset_id: string) => void
    RemLastViewFrame: () => void
    CreateViewFrame: () => void
    ClearFrames: () => void
    RemFrame: (frameset_id: string) => (frame_id: string) => void
    syncFrames: (frame_id: string, newframes: IFrameRow[]) => void
    setHFrameStack: React.Dispatch<React.SetStateAction<IHFramesSet>>
    changeCols: (vfs_id: string, f_id: string) => {
        UP: (row_id: string) => void
        Down: (row_id: string) => void
    }
}
// export type INodeCols = { id: string, row_id: string }

export type VMRowProps = {
    data: DataRow
    props: {
        isSelected?: boolean
        isOnEdit?: boolean
        fs_id: string,
        isFram: boolean,
        frameType: IFrameType
    }

    addNode: (row_id: string) => void,
    remNode: (row_id: string) => void,
    rowUp: () => void,
    rowDown: (row_id?: string) => void
}
export type FramesStackProps = {
    isSelected?: boolean
    data?: DataVFrameSet
    align?: 'top' | 'bot' | 'mid'
    justify?: 'left' | 'right' | 'mid'
} & DivProps
export interface FNodeProps {
    data?: DataNode
    props?: {
        isFram: boolean
        row_id: string
        frameType?: 'door' | 'win'
        children?: React.ReactNode
    }
    isFram: boolean
    row_id: string
    frameType?: 'door' | 'win'
    children?: React.ReactNode
}