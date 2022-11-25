import { GridRowEncode, useUtils } from "../hooks/useUtils";
import { IFrameBox, IFrameStore, IFrameStoreItem } from "../Types/FStoreTypes";

const genID = useUtils.stringID


class FrameStore implements IFrameStore {
    store: IFrameStoreItem[] | []
    storeName?: string
    constructor() {
        this.store = [] as IFrameStoreItem[]
        this.storeName = 'FStore1'
        this.init()
    }
    save(frames: any) {
        const savedFrames = JSON.stringify(frames)
        localStorage.setItem(`store_${this.storeName}`, savedFrames)
        return this.store
    }

    init() {
        const sname = `store_${this.storeName}`
        const loadedFrames = localStorage.getItem(sname)
        if (!loadedFrames) return console.log('No frames saved');

        try {

            const parsed = JSON.parse(loadedFrames)
            this.store = parsed

            console.log('FrameBox: ', this.store);

            return this.store
        } catch (e: any) {
            return console.log(e.message);

        }
    }


}

class FrameLibrary {
    store: IFrameStoreItem[]
    constructor() {
        this.store = []
        this.init()
        this.listItems()
    }
    add(fsItem: IFrameStoreItem) {

        const { frameCode } = fsItem
        const hasSimilar = this.store.some(fsI => fsI.frameCode === frameCode)
        // if (hasSimilar) return console.log('Повтор Конструкции', fsItem);

        this.store.push(fsItem)
        this.saveToLS()
        return this.store
    }
    addFrames(frame_models: IFrameBox) {
        const encoded = frame_models.map(frame => GridRowEncode(frame.grid)).join('-')
        const hasSimilar = this.store.some(fsI => fsI.frameCode === encoded)
        if (hasSimilar) return console.log("Такая модель уже есть в списке!");

        const prepareModels = (models: IFrameBox) => {
            const frName = `fsi#${genID()}`
            const item: IFrameStoreItem = {
                id: genID(),
                frameName: frName,
                frameBox: [...models],
                frameCode: encoded
            }
            return item
        }
        const newitem = prepareModels(frame_models)
        this.store.push(newitem)
        this.saveToLS()
        return this.store
    }

    rem(fsItem_id: string) {
        return this.store.filter(fsi => fsi.id !== fsItem_id)
    }
    load(fsi_id: string) {
        return this.store.filter(i => i.id === fsi_id)
    }
    listItems() {

        const codes = this.store.map(item => item.frameCode)
        const sorted = new Set(codes)
        console.log('codes: ', sorted.values());

        return this.store
    }
    saveToLS() {
        localStorage.setItem('frames_lib', JSON.stringify(this.store))
        return this.store
    }
    init() {
        const loadedStore = localStorage.getItem('frames_lib')
        if (loadedStore) {
            this.store = JSON.parse(loadedStore)
        } else this.store = []
        return this.store
    }
}




'123-456'.split('-').map(c => c.split('').map(cc => ({ cols: cc })))
export const FStore = new FrameStore()
export const FramesLib = new FrameLibrary()