import { ICalcModelNode_v1, IPosOffset, INodeBorder, ISizeWH, ISideStateValues, IModelDelta, INodeDelta, INodeVariant, IBorders, ISides2, ISides, ICoords, IBordersCls } from "../../Types/CalcModuleTypes";
import { EmptyBorders, TemplateBorders } from "./CalcModelTemplates";
import { ICNodeMethods, IParams_CalcNode, ID } from "./CalcModel.v1";
import { ISide } from "../../Types/FrameTypes";
import { BORDER, DIR } from "../../Types/Enums";
import { Border, Impost, Rama } from "./Border";
import { Size } from "./Size";

type IDir = keyof typeof DIR
type IConvert = { [K: string]: ISideStateValues }
type presetKeys = keyof typeof FixBorderPreset
type BorderPresets = Record<presetKeys, IBordersCls>
export class CalcNode_v2 {
    id: string
    Pos: ICoords
    borders: IBordersCls
    PosOffset?: ICoords
    NSize: Size
    nDelta?: INodeDelta;


    constructor(size: { w: number, h: number }) {
        this.id = ID()
        this.borders = this.loadPreset('FixBorders')
        this.Pos = [0, 0]
        this.NSize = this.setSizeAndOffset(size)
        // console.log('Cnode_v2', this)
    }

    setPos(x = 0, y = 0) {
        this.Pos = [x, y]
        return this
    }
    private setOffset() {
        if (!this.NSize || !this.Pos) return this
        const [x, y] = this.Pos
        const [ox, oy] = [x + this.NSize.w, y + this.NSize.h,]
        this.PosOffset = [ox, oy]
        this.updateEndPoints()
        return this
    }
    private setSizeAndOffset(size: Size) {
        this.NSize = new Size(size.w, size.h)
        this.setOffset()

        return this.NSize
    }
    loadPreset(preset: presetKeys = 'FixBorders') {
        this.borders = { ...this.borders, ...FixBorderPreset[preset] }
        return FixBorderPreset[preset]
    }
    setBorders(new_borders: IBordersCls) {
        this.borders = { ...this.borders, ...new_borders }
        this.updateEndPoints()
        return this
    }
    setBorder(side: ISides2, newBorder: Border) {
        this.borders = { ...this.borders, [side]: newBorder }
        this.updateEndPoints()
        return this
    }
    updateEndPoints() {
        const [x, y] = this.Pos
        const [ox, oy] = this.PosOffset!
        const pos: Record<'LB' | 'LT' | 'RT' | 'RB', ICoords> = {
            LB: [x, y],
            LT: [x, oy],
            RT: [ox, oy],
            RB: [ox, y]
        }

        const EndPoints: Record<ISides2, { start: ICoords, end: ICoords }> = {
            left: { start: pos.LB, end: pos.LT },
            right: { start: pos.RB, end: pos.RT },
            top: { start: pos.LT, end: pos.RT },
            bottom: { start: pos.LB, end: pos.RB },
        }
        for (let s in EndPoints) {
            const side = s as ISides2
            this.borders[side].setEndPoints(EndPoints[side].start, EndPoints[side].end)
        }
        return this.borders
    }
    getEndPoints(side: ISides2) {
        return this.borders[side].endPoints
    }
    changeSize(size: Partial<ISizeWH>) {
        if (!this.NSize) {
            console.error('Size Not defined', this.NSize)
            return this
        }

        const keys = Object.keys(size) as unknown as Array<keyof ISizeWH>
        const cb = (key: keyof typeof size) => {
            this.NSize = { ...this.NSize, [key]: size[key] }
        }

        keys.forEach(cb)

        this.setOffset()
        return this
    }

    changePos(newPos: { x?: number, y?: number }) {
        if (!this.Pos) {
            console.log('Position not defined')
            return this
        }


        const [new_x, new_y] = [newPos.x || this.Pos[0], newPos.y || this.Pos[1]]
        this.setPos(new_x, new_y)

        this.setOffset()
        return this
    }
    changeBorderState(side: ISides2, state: ISideStateValues) {
        const b = this.borders[side].convertTo(state)
        this.borders = { ...this.borders, [side]: b }
        this.updateEndPoints()
        return this
    }

}

export const FixBorderPreset = {
    FixBorders: {
        bottom: new Rama(),
        left: new Rama(),
        right: new Rama(),
        top: new Rama(),
    },
    LN_Borders: {
        bottom: new Rama(),
        left: new Rama(),
        right: new Impost(),
        top: new Rama(),
    },
    RN_Borders: {
        bottom: new Rama(),
        left: new Impost(),
        right: new Rama(),
        top: new Rama(),
    },
    TN_Borders: {
        bottom: new Impost(),
        left: new Rama(),
        right: new Rama(),
        top: new Rama(),
    },
    BN_Borders: {
        bottom: new Rama(),
        left: new Rama(),
        right: new Rama(),
        top: new Impost(),
    },

}






//  setBorders(new_borders: IBorders) {
//         const SidesArray = ['bottom', 'left', 'right', 'top'] as ISides2[]
//         SidesArray.forEach(s => {
//             const newState = new_borders[s].state
//             const newDesc = BORDER[newState]
//             this.borders = { ...this.borders, [s]: { state: newState, desc: newDesc } }
//         })
//         return this
//     }
// changeBorders(new_borders: Partial<IBorders>) {
//         const keys = Object.keys(new_borders) as ISides2[]
//         const cb = (K: ISides2) => {
//             const newState = new_borders[K]!.state
//             const newDesc = BORDER[newState]
//             this.borders = { ...this.borders, [K]: { state: newState, desc: newDesc } }
//         }
//         keys.forEach(cb)
//         return this
//     }
//     changeBorderState(side: ISides2, border_state: ISideStateValues) {
//         this.borders = { ...this.borders, [side]: { state: border_state, desc: BORDER[border_state] } }
//         return this
//     }
//  stateShift(side: ISides2) {
//         const conv: IConvert = {
//             toFix: 'imp',
//             toStv: 'stv_imp',
//             toSvet: 'svet',
//         }
//         const prev = this.borders[side].state
//         if (prev === 'rama') this.changeBorderState(side, conv.toFix)
//         if (prev === 'stv_rama') this.changeBorderState(side, conv.toStv)
//         if (prev === 'svet') this.changeBorderState(side, conv.toSvet)

//         return this
//     }
// updateDelta(delta: IModelDelta) {


//         this.nDelta = {
//             bottom: delta[this.borders.bottom.state]!,
//             left: delta[this.borders.left.state]!,
//             top: delta[this.borders.top.state]!,
//             right: delta[this.borders.right.state]!,
//         }

//         return this
//     }