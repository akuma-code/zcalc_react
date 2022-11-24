import { IFrameStore, IFrameStoreItem } from "../Types/FStoreTypes";

class FrameStore implements IFrameStore {
    store: IFrameStoreItem[] | []
    storeName?: string
    constructor() {
        this.store = [] as IFrameStoreItem[]
        this.storeName = 'FStore1'
        this.load()
    }

    save(frames: any) {
        const savedFrames = JSON.stringify(frames)
        localStorage.setItem(`store_${this.storeName}`, savedFrames)
        return this.store
    }

    load() {
        const sname = `store_${this.storeName}`
        const loadedFrames = localStorage.getItem(sname)
        if (!loadedFrames) return console.log('No frames saved');

        console.log('loadedFrames', loadedFrames)
        try {

            const parsed = JSON.parse(loadedFrames)
            this.store = parsed
            return this.store
        } catch (e: any) {
            return console.log(e.message);

        }
    }
}

export const FStore = new FrameStore()