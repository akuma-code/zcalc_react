import { ICalcModelNode_v1, IPosOffset, INodeBorder, ISizeWH, ISideStateValues, IProfileDelta, INodeDelta, INodeVariant, IBorders, ISides2, ISides } from "../../Types/CalcModuleTypes";
import { EmptyBorders, TemplateBorders } from "./CalcModelTemplates";
import { ICNodeMethods, IParams_CalcNode, ID } from "../CalcModels/CalcModels";
import { ISide } from "../../Types/FrameTypes";
import { BORDER } from "../../Types/Enums";


type IConvert = { [K: string]: ISideStateValues }
export class CalcNode_v2 {
    id: string
    Pos: { x: number, y: number }
    borders: IBorders
    PosOffset?: { ox: number, oy: number }
    NSize?: { w: number; h: number; }
    nDelta?: INodeDelta;
    nType?: INodeVariant

    constructor(size?: { w: number, h: number }) {
        this.id = ID()
        this.borders = { top: {}, bottom: {}, left: {}, right: {} } as IBorders
        this.Pos = { x: 0, y: 0 }
        this.initBorders()
        size && this.setSizeAndOffset(size)
        // console.log('Cnode_v2', this)
    }

    private setPos({ x = 0, y = 0 }) {
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
            top: { state: 'rama' },
            left: { state: 'rama' },
            right: { state: 'rama' },
            bottom: { state: 'rama' },
        })
        return this.borders
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
    private setSizeAndOffset({ w, h }: ISizeWH) {
        this.NSize = { w, h }
        this.setOffset()
        return this
    }
    changeSize(size: Partial<ISizeWH>) {
        if (!this.NSize) {
            console.error('Size Not defined', this.NSize)
            return this
        }

        const keys = Object.keys(size) as unknown as Array<keyof ISizeWH>
        const cb = (key: keyof typeof size) => { if (this.NSize) this.NSize = { ...this.NSize, [key]: size[key] } }

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

    static cloneNode(Node: CalcNode_v2) {
        const newNode = new CalcNode_v2(Node.NSize)
        newNode.setBorders(Node.borders)
            .setPos(Node.Pos)
        return newNode
    }

    static DevideVertical(node: CalcNode_v2) {
        const subNodes = splitNode_Ver(node)
        console.log('subNodes', subNodes)
        return subNodes
    }
    static DevideHorizontal(node: CalcNode_v2) {
        const subNodes = splitNode_Hor(node)
        console.log('subNodes', subNodes)
        return subNodes
    }
}

function splitNode_Ver(node: CalcNode_v2) {
    const { Pos, PosOffset, NSize } = node
    const offsetX = (PosOffset!.ox - Pos.x) / 2
    const changes = {
        left: {
            PosOffset: { ox: offsetX },
            NSize: { w: +NSize!.w / 2 }
        },
        right: {
            NSize: { w: +NSize!.w / 2 },
            Pos: { x: Pos.x + offsetX }
        }
    }

    const LNode = CalcNode_v2.cloneNode(node)
    const RNode = CalcNode_v2.cloneNode(node)

    LNode.changeSize(changes.left.NSize)
        .stateShift('right')

    RNode.changeSize(changes.right.NSize)
        .stateShift('left')
        .changePos(changes.right.Pos)
    return [LNode, RNode] as const
}
function splitNode_Hor(node: CalcNode_v2) {
    const { Pos, PosOffset, NSize } = node
    const offsetY = (PosOffset!.oy - Pos.y) / 2
    const changes = {
        bottom: {
            PosOffset: { oy: offsetY },
            NSize: { h: +NSize!.h / 2 }
        },
        top: {
            PosOffset: { oy: offsetY },
            NSize: { h: +NSize!.h / 2 }
        }
    }

    const BotNode = CalcNode_v2.cloneNode(node)
    const TopNode = CalcNode_v2.cloneNode(node)

    BotNode.changeSize(changes.bottom.NSize)
        .stateShift('right')
    TopNode.changeSize(changes.top.NSize)
        .stateShift('left')
    return [BotNode, TopNode] as const
}