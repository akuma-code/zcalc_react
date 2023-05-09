import { ICalcModelNode_v1, IPosOffset, INodeBorder, ISizeWH, ISideStateValues, IModelDelta, INodeDelta, INodeVariant, IBorders, ISides2, ISides, ICoords, IBordersCls } from "../../Types/CalcModuleTypes";
import { EmptyBorders, TemplateBorders } from "./CalcModelTemplates";
import { ICNodeMethods, IParams_CalcNode, ID } from "./CalcModel.v1";
import { ISide } from "../../Types/FrameTypes";
import { BorderDescEnum, DIR, DIRECTION } from "../../Types/Enums";
import { Border, FixBorderPreset, Impost, Rama } from "./Border";
import { Size } from "./Size";
import { EndPoint } from "./EndPoint";
import { consumeNode } from "./HelperFns";
// import { getNodeImposts } from "./HelperFns";

type IDir = keyof typeof DIR
type IConvert = { [K: string]: ISideStateValues }
type presetKeys = keyof typeof FixBorderPreset
type BorderPresets = Record<presetKeys, IBordersCls>
export class CalcNode_v2 {
    id: string
    size: Size
    borders: IBordersCls
    Pos: ICoords
    PosOffset!: ICoords
    nDelta!: INodeDelta;


    constructor(size: { w: number, h: number }) {
        this.id = ID()
        this.borders = this.loadBordersPreset('FixBorders')
        this.size = this.setSizeAndOffset(size)
        this.Pos = [0, 0]

        // console.log('Cnode_v2', this)
    }
    // get coords() {
    //     // if(!this.PosOffset) return false
    //     return [...this.Pos, ...this.PosOffset] as const
    // }
    setPos(...args: ICoords) {
        this.Pos = args
        this.setOffset()
        // this.updateEndPoints()
        return this
    }
    private setOffset() {
        if (!this.size || !this.Pos) return this
        const [x, y] = this.Pos
        const [ox, oy] = [x + this.size.w, y + this.size.h,]
        this.PosOffset = [ox, oy]
        this.updateEndPoints()
        return this
    }
    private setSizeAndOffset(size: Size) {
        this.size = new Size(size.w, size.h)
        this.setOffset()
        // this.updateEndPoints()
        return this.size
    }
    loadBordersPreset(preset: presetKeys = 'FixBorders') {
        this.borders = { ...this.borders, ...FixBorderPreset[preset] }
        this.setOffset()
        return FixBorderPreset[preset]
    }
    setBorders(new_borders: IBordersCls) {
        this.borders = { ...this.borders, ...new_borders }
        // this.updateEndPoints()
        this.setOffset()
        return this
    }
    setBorder(side: ISides2, newBorder: Border) {
        this.borders = { ...this.borders, [side]: newBorder }
        this.updateEndPoints()
        return this
    }
    updateEndPoints() {
        // if ( !this.PosOffset) return this
        const [x, y] = this.Pos
        const [ox, oy] = this.PosOffset
        const pos: Record<'LeftBot' | 'LeftTop' | 'RightTop' | 'RightBot', ICoords> = {
            LeftBot: [x, y],
            LeftTop: [x, oy],
            RightTop: [ox, oy],
            RightBot: [ox, y]
        }

        // const EndPoints: Record<ISides2, EndPoint> = {
        //     top: new EndPoint(pos.LeftTop, pos.RightTop),
        //     left: new EndPoint(pos.LeftBot, pos.LeftTop),
        //     right: new EndPoint(pos.RightBot, pos.RightTop),
        //     bottom: new EndPoint(pos.LeftBot, pos.RightBot),
        // }
        const EPoints: Record<ISides2, [readonly [number, number], readonly [number, number]]> = {
            top: [pos.LeftTop, pos.RightTop],
            left: [pos.LeftBot, pos.LeftTop],
            right: [pos.RightBot, pos.RightTop],
            bottom: [pos.LeftBot, pos.RightBot],
        }
        for (let s in EPoints) {
            const side = s as ISides2
            const newEP = new EndPoint(...EPoints[side])
            const { start, end } = newEP
            this.borders[side].setEndPoints(start, end)
        }
        // console.count('updated endpoints')
        return this
    }
    // getEndPoints(side: ISides2) { return this.borders[side].endPoints }
    // getBordersArray() { return Object.entries(this.borders).map(([k, v]) => ({ ...v, side: k, node_id: this.id })) }
    // getImposts() { return getNodeImposts(this) }
    changeSize(size: Partial<ISizeWH>) {
        if (!this.size) {
            console.error('Size Not defined', this.size)
            return this
        }

        const keys = Object.keys(size) as unknown as Array<keyof ISizeWH>
        const cb = (key: keyof typeof size) => {
            this.size = { ...this.size, [key]: size[key] }
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
    absorbNode(node: CalcNode_v2) {
        consumeNode(this, node)
        return this
    }
    devideNode(dir: DIRECTION) {
        if (dir === DIRECTION.VERT) {

        }
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