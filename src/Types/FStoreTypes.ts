export interface IFrameStoreItem {
    id: string
    frameName: string
    frameBox: Array<{
        id: string,
        rows: Array<{ row_id: string, col: number }>
    }>
    frameCode?: string
}

export interface IFrameStore {
    store: IFrameStoreItem[]
}


export type IFrameBox = IFrameStoreItem['frameBox']
