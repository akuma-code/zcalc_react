import { ISize } from "../../../Types/FrameTypes"
import { _ID } from "../../Constructor/ViewModel/ViewModelConst"

export interface ICoords_OBJ {
    x: number
    y: number
}
export interface IModelSize {
    h: number
    w: number
}

export class OffsetFrameModel {
    id: string
    constructor(
        public w: number,
        public h: number,
        public pos?: ICoords_OBJ
    ) {
        this.id = _ID()
        this.w = w
        this.h = h
        this.pos = pos || { x: 0, y: 0 }
    }

}

export class OffsetCanvas {
    VMs = [] as OffsetFrameModel[]
    // constructor() {
    //     this.VMs = []
    //     console.log('viewModels', this.VMs)
    // }
    init() {
        if (this.VMs.length > 0) {
            console.log('Init failed')
            // return this.VMs
        }
        console.log('init')
        this.VMs = []
        // const newmodel = new OffsetFrameModel(6, 10)
        // this.VMs.push(new OffsetFrameModel(6, 10))
        // return this.VMs
    }

    appendRight(w: number, h: number) {
        // if (this.VMs.length === 0) return this.init()
        const pos = this.VMs.reduce((off, current) => {
            off.x += current.w
            off.y = 0
            return off
        }, { x: 0, y: 0 })
        // const newmodel = new OffsetFrameModel(w, h, pos)
        this.VMs.push(new OffsetFrameModel(w, h, pos))
        // return newmodel
    }
    appendTop(w: number, h: number) {
        const off = this.VMs.reduce((off, current) => {
            off.x = 0
            off.y += current.h
            return off
        }, { x: 0, y: 0 })
        this.VMs.push(new OffsetFrameModel(w, h, off))
    }

    reset() {
        // console.log('Restarted');
        // console.log('viewModels', this.VMs)
        this.VMs = []
    }

    getCopy() {
        const newCanvas = new OffsetCanvas()
        newCanvas.VMs = this.VMs
        return newCanvas
    }


}

