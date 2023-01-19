import { ISide, ISize } from "../../../Types/FrameTypes"
import { _ID } from "../../Constructor/ViewModel/ViewModelConst"

export interface ICoords {
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
        public pos?: ICoords
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
        console.log('Restarted');
        console.log('viewModels', this.VMs)
        this.VMs = []
    }

    getCopy() {
        const newCanvas = new OffsetCanvas()
        newCanvas.VMs = this.VMs
        return newCanvas
    }
}

export class BlueprintModel {
    id: string
    Pos: ICoords     // координаты нулевой точки на чертеже
    // offset?: ICoords //сдвиг из предыдущей модели
    Size: { w: number, h: number }
    constructor(w: number, h: number, Pos = { x: 0, y: 0 },) {
        this.Pos = Pos
        // this.offset = {
        //     x: Pos.x + w,
        //     y: Pos.y + h,
        // }
        this.Size = { w, h }
        this.id = _ID()
    }

    appendAsSize(w: number, h: number) {
        return (side: ISide) => new BlueprintModel(w, h, this.PositionOffset(side))
    }

    PositionOffset(side: ISide) {
        const offsetRight = { x: this.Pos.x + this.Size.w, y: this.Pos.y }
        const offsetLeft = { x: this.Pos.x - this.Size.w, y: this.Pos.y }
        const offsetBot = { x: this.Pos.x, y: this.Pos.y + this.Size.h }
        const offsetTop = { x: this.Pos.x, y: this.Pos.y - this.Size.h }

        const offsetPosition = {
            right: offsetRight,
            left: offsetLeft,
            top: offsetTop,
            bot: offsetBot
        }

        return offsetPosition[side]
    }

}


export class Blueprint {
    bpModels = [] as BlueprintModel[]

    HandleUpdate() {
        const BPCopy = new Blueprint()
        BPCopy.bpModels = this.bpModels
        return BPCopy
    }

    reset() {
        return this.bpModels = []
    }

    init(w: number, h: number) {
        const nm = new BlueprintModel(w, h)
        this.bpModels = [nm]
        return this.bpModels
    }

    add(model: BlueprintModel) {
        this.bpModels.push(model)
        return this
    }
    maxX() {
        const models = this.bpModels
        models.sort((a, b) => {
            const offA = a.Pos.x + a.Size.w
            const offB = b.Pos.x + b.Size.w
            return offA - offB
        })
        return models[models.length - 1]?.id
    }
}