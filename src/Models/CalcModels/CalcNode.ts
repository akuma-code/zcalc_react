import { ICalcModelNode_v1, IPosOffset, INodeBorder, ISizeWH, ISideStateValues, IProfileDelta, INodeDelta } from "../../Types/CalcModuleTypes";
import { EmptyBorders, TemplateBorders } from "./CalcModelTemplates";
import { ICNodeMethods, IParams_CalcNode, ID } from "../CalcModels/CalcModels";
import { ISide } from "../../Types/FrameTypes";
import { BORDER } from "../../Types/Enums";

//** _____________________class CalcNODE */
//TODO: initBorders, initBordersTemplate, initPos, initDelta




export class CalcNode implements ICalcModelNode_v1, ICNodeMethods {
    id: string;
    POS?: IPosOffset | undefined;
    NSize?: { w: number; h: number; } | undefined;
    borders?: INodeBorder[] | [];
    nDelta?: INodeDelta | undefined;
    constructor() {
        this.id = ID();
        this.borders = EmptyBorders
        // this.initSize(nodeSize);
        // this.initPos(POS);
    }
    get size() {
        if (!this.POS || !this.POS.ox || !this.POS.oy) return { w: -1, h: -1 }
        const size = { w: this.POS.ox - this.POS.x, h: this.POS.oy - this.POS.y }
        return size
    }
    initBorders(newBorders?: INodeBorder[]) {
        if (!newBorders) {
            console.log('Used Template!');

            this.borders = TemplateBorders.fix;
            return this;
        }
        this.borders = newBorders;
        return this;
    }
    initPos(newPos?: IPosOffset) {
        if (!newPos) {
            this.POS = { ...this.POS, x: 0, y: 0 };
            return this;
        }
        // if (this.NSize) {
        //     this.POS = {
        //         ...this.POS,
        //         ...newPos,
        //         ox: newPos.x + this.NSize.w, oy: newPos.y + this.NSize!.h,
        //     };
        //     return this;
        // }
        this.POS = { ...this.POS, ...newPos };
        return this;
    }
    initSize(newSize?: ISizeWH) {
        if (!newSize) {

            return this
        };
        this.NSize = { w: newSize.w, h: newSize.h };
        return this;
    }
    setBorder(side: ISide, state: ISideStateValues) {
        if (!this.borders) throw new Error("Borders not defined!");

        const nb = [...this.borders].map(b => b.side === side ? { ...b, state: state, desc: BORDER[state] } : b)
        this.borders = nb
        return this
    }
    editBorder(side: ISide, newBorder: INodeBorder) {
        if (!this.borders) throw new Error("Borders not defined!");

        const nb = [...this.borders].map(b => b.side === side ? { ...b, ...newBorder } : b)
        this.borders = nb
        return this
    }
    initDelta(systemDelta: IProfileDelta) {
        if (!this.borders) throw new Error("Borders not defined!");
        this.nDelta = [...this.borders].reduce((nd, border) => {
            if (!border.state) throw new Error("border state not defined/inited!");
            const d = systemDelta[border.state!]
            nd = { ...nd, [border.side]: d }
            return nd
        }, { top: 0, bot: 0, left: 0, right: 0 } as INodeDelta)
        return this
    }

}
