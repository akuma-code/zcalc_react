export interface IFrameStoreItem {
    id: string
    frameName: string
    frameBox: {
        id: string
        grid: {
            row_id: string
            cols: number
        }[]
    }[]
}

export interface IFrameStore {
    store: IFrameStoreItem[]
}


export type IFrameBox = IFrameStoreItem['frameBox']
