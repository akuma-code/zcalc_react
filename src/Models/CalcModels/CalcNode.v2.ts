import { ICalcModelNode_v1, IPosOffset, INodeBorder, ISizeWH, ISideStateValues, IModelDelta, INodeDelta, INodeVariant, IBorders, ISides2, ISides, ICoords, IBordersCls } from "../../Types/CalcModuleTypes";
import { EmptyBorders, TemplateBorders } from "./CalcModelTemplates";
import { ICNodeMethods, IParams_CalcNode, ID } from "./CalcModel.v1";
import { ISide } from "../../Types/FrameTypes";
import { BorderDesc, DIR } from "../../Types/Enums";
import { Border, FixBorderPreset, Impost, Rama } from "./Border";
import { Size } from "./Size";
import { EndPoint } from "./EndPoint";
import { getNodeImposts } from "./HelperFns";

type IDir = keyof typeof DIR
type IConvert = { [K: string]: ISideStateValues }
type presetKeys = keyof typeof FixBorderPreset
type BorderPresets = Record<presetKeys, IBordersCls>
export class CalcNode_v2 {
    id: string
    NSize: Size
    borders: IBordersCls
    Pos: ICoords
    PosOffset!: ICoords
    nDelta!: INodeDelta;


    constructor(size: { w: number, h: number }) {
        this.id = ID()
        this.borders = this.loadBordersPreset('FixBorders')
        this.NSize = this.setSizeAndOffset(size)
        this.Pos = [0, 0]

        // console.log('Cnode_v2', this)
    }

    setPos(...args: ICoords) {
        this.Pos = args
        this.setOffset()
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
        // this.updateEndPoints()
        return this.NSize
    }
    loadBordersPreset(preset: presetKeys = 'FixBorders') {
        this.borders = { ...this.borders, ...FixBorderPreset[preset] }
        // this.updateEndPoints()
        this.setOffset()
        return FixBorderPreset[preset]
    }
    setBorders(new_borders: IBordersCls) {
        this.borders = { ...this.borders, ...new_borders }
        // this.updateEndPoints()
        return this
    }
    setBorder(side: ISides2, newBorder: Border) {
        this.borders = { ...this.borders, [side]: newBorder }
        // this.updateEndPoints()
        return this
    }
    updateEndPoints() {
        if (!this.Pos || !this.PosOffset) return this
        const [x, y] = this.Pos
        const [ox, oy] = this.PosOffset
        const pos: Record<'LB' | 'LT' | 'RT' | 'RB', ICoords> = {
            LB: [x, y],
            LT: [x, oy],
            RT: [ox, oy],
            RB: [ox, y]
        }

        const EndPoints: Record<ISides2, EndPoint> = {
            left: new EndPoint(pos.LB, pos.LT),
            right: new EndPoint(pos.RB, pos.RT),
            top: new EndPoint(pos.LT, pos.RT),
            bottom: new EndPoint(pos.LB, pos.RB),
        }
        for (let s in EndPoints) {
            const side = s as ISides2
            // this.borders[side]=EndPoints[side]
            this.borders[side].setEndPoints(EndPoints[side].start, EndPoints[side].end)
        }
        // console.count('updated endpoints')
        return this
    }
    getEndPoints(side: ISides2) { return this.borders[side].endPoints }
    getBordersArray() { return Object.entries(this.borders).map(([k, v]) => ({ ...v, side: k, node_id: this.id })) }
    getImposts() { return getNodeImposts(this) }
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
        this.setOffset()
        return this
    }

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