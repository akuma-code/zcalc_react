import { ICalcModelNode_v1, IPosOffset, INodeBorder, ISizeWH } from "../../Types/CalcModuleTypes";
import { TemplateBorders } from "./CalcModelTemplates";
import { ICNodeMethods, IParams_CalcNode, ID } from "../CalcModels/CalcModels";

//** _____________________class CalcNODE */
//TODO: initBorders, initBordersTemplate, initPos, initDelta


export class CalcNode implements ICalcModelNode_v1, ICNodeMethods {
    id: string;
    POS?: IPosOffset | undefined;
    NSize?: { w: number; h: number; } | undefined;
    borders?: INodeBorder[] | [];

    constructor({ NSize: nodeSize, POS }: IParams_CalcNode, borders?: INodeBorder[]) {
        this.id = ID();
        this.initSize(nodeSize);
        this.initPos(POS);
        // this.initBorders(borders);
        // this.borders = borders || [] as INodeBorder[]
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
        if (newPos && this.NSize) {
            this.POS = {
                ...this.POS,
                ...newPos,
                ox: newPos.x + this.NSize.w, oy: newPos.y + this.NSize!.h,
            };
            return this;
        }
        this.POS = { ...this.POS, ...newPos };
        return this;
    }
    initSize(newSize?: ISizeWH) {
        if (!newSize)
            return this;
        this.NSize = { ...this.NSize, ...newSize };
        return this;
    }


}
