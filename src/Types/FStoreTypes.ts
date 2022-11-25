export interface IFrameStoreItem {
    id: string
    frameName: string
    frameBox: Array<{
        id: string,
        grid: Array<{ row_id: string, cols: number }>
    }>
    frameCode?: string
}

export interface IFrameStore {
    store: IFrameStoreItem[]
}


export type IFrameBox = IFrameStoreItem['frameBox']
