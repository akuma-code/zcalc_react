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
    ) {
        this.id = _ID()
        this.w = w
        this.h = h
    }

}

export class OffsetCanvas {
    x0: number
    y0: number
    offset: ICoords
    constructor(

    ) {
        this.x0 = 0
        this.y0 = 0
        this.offset = { x: 0, y: 0 }
    }


    addFrame(frame: OffsetFrameModel) {
        this.offset = {
            x: this.offset.x + frame.w,
            y: this.offset.y + frame.h
        }


    }
}