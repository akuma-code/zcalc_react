import { ICalcModelNode_v1, IPosOffset, INodeBorder, ISizeWH, ISideStateValues, IModelDelta, INodeDelta, INodeVariant, IBorders, ISides2, ISides } from "../../Types/CalcModuleTypes";
import { EmptyBorders, TemplateBorders } from "./CalcModelTemplates";
import { ICNodeMethods, IParams_CalcNode, ID } from "./CalcModel.v1";
import { ISide } from "../../Types/FrameTypes";
import { BORDER, DIR } from "../../Types/Enums";

type IDir = keyof typeof DIR
type IConvert = { [K: string]: ISideStateValues }
export class CalcNode_v2 {
    id: string
    Pos: { x: number, y: number }
    borders: IBorders
    PosOffset?: { ox: number, oy: number }
    NSize?: { w: number; h: number; }
    nDelta?: INodeDelta;


    constructor(size?: { w: number, h: number }) {
        this.id = ID()
        this.borders = { top: {}, bottom: {}, left: {}, right: {} } as IBorders
        this.Pos = { x: 0, y: 0 }
        this.initBorders()
        size && this.setSizeAndOffset(size)
        // console.log('Cnode_v2', this)
    }

    setPos({ x = 0, y = 0 }) {
        this.Pos = { x, y }
        return this
    }
    private setOffset() {
        if (!this.NSize) return this
        this.PosOffset = {
            ox: this.Pos.x + this.NSize.w,
            oy: this.Pos.y + this.NSize.h,
        }
        return this
    }
    private initBorders() {
        this.setBorders({
            top: { state: 'rama', desc: BORDER['rama'] },
            left: { state: 'rama', desc: BORDER['rama'] },
            right: { state: 'rama', desc: BORDER['rama'] },
            bottom: { state: 'rama', desc: BORDER['rama'] },
        })
        return this.borders
    }
    private setSizeAndOffset({ w, h }: ISizeWH) {
        this.NSize = { w, h }
        this.setOffset()
        return this
    }

    setBorders(new_borders: IBorders) {
        const SidesArray = ['bottom', 'left', 'right', 'top'] as ISides2[]
        SidesArray.forEach(s => {
            const newState = new_borders[s].state
            const newDesc = BORDER[newState]
            this.borders = { ...this.borders, [s]: { state: newState, desc: newDesc } }
        })
        return this
    }
    changeSize(size: Partial<ISizeWH>) {
        if (!this.NSize) {
            console.error('Size Not defined', this.NSize)
            return this
        }

        const keys = Object.keys(size) as unknown as Array<keyof ISizeWH>
        const cb = (key: keyof typeof size) => {
            if (this.NSize) this.NSize = { ...this.NSize, [key]: size[key] }
        }

        keys.forEach(cb)

        this.setOffset()
        return this
    }
    changeBorders(new_borders: Partial<IBorders>) {
        const keys = Object.keys(new_borders) as ISides2[]
        const cb = (K: ISides2) => {
            const newState = new_borders[K]!.state
            const newDesc = BORDER[newState]
            this.borders = { ...this.borders, [K]: { state: newState, desc: newDesc } }
        }
        keys.forEach(cb)
        return this
    }
    changeBorderState(side: ISides2, border_state: ISideStateValues) {
        this.borders = { ...this.borders, [side]: { state: border_state, desc: BORDER[border_state] } }
        return this
    }
    changePos(newPos: { x?: number, y?: number }) {
        if (!this.Pos) {
            console.log('Position not defined')
            return this
        }

        const Keys = Object.keys(newPos) as unknown as Array<keyof typeof newPos>

        Keys.forEach(K => {
            this.Pos = { ...this.Pos, [K]: newPos[K] }
        })

        this.setOffset()
        return this
    }
    stateShift(side: ISides2) {
        const conv: IConvert = {
            toFix: 'imp',
            toStv: 'stv_imp',
            toSvet: 'svet',
        }
        const prev = this.borders[side].state
        if (prev === 'rama') this.changeBorderState(side, conv.toFix)
        if (prev === 'stv_rama') this.changeBorderState(side, conv.toStv)
        if (prev === 'svet') this.changeBorderState(side, conv.toSvet)

        return this
    }
    updateDelta(delta: IModelDelta) {


        this.nDelta = {
            bottom: delta[this.borders.bottom.state]!,
            left: delta[this.borders.left.state]!,
            top: delta[this.borders.top.state]!,
            right: delta[this.borders.right.state]!,
        }

        return this
    }
}


