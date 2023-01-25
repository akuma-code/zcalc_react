import { ISide } from "../../../Types/FrameTypes";
import { _ID } from "../../Constructor/ViewModel/ViewModelConst";
import { ICoords } from "./OffsetModel";



export class Blueprint {
    bpModels = [] as BlueprintModel[];
    GlobalOffset = { x: 0, y: 0 }
    HandleUpdate() {
        this.applyGlobalOffset(this.bpModels)
        const BPCopy = new Blueprint();
        BPCopy.bpModels = this.bpModels
        return BPCopy;
    }

    reset() {
        return this.bpModels = [];
    }

    init(w: number, h: number) {
        const nm = new BlueprintModel(w, h);
        this.bpModels = [nm];
        return this.bpModels;
    }

    add(model: BlueprintModel) {
        this.bpModels.push(model);
        return this;
    }


    offsetMap(models: BlueprintModel[]) {
        const off = models.map(m => m.offset);
        return off;
    }

    OPMap() {

        return [...this.bpModels].map(m => m.OffPos)
    }

    findTopAndLeftOffset(models = this.bpModels) {
        const mds = [...models].map(m => m.OffPos)
        const top = mds.reduce((minTop, m) => m.Py < minTop.Py ? ({ ...minTop, ...m }) : minTop, { Py: 0, Px: 0, Ox: 0, Oy: 0 })
        const left = mds.reduce((minLeft, m) => m.Px < minLeft.Px ? ({ ...minLeft, ...m }) : minLeft, { Py: 0, Px: 0, Ox: 0, Oy: 0 })
        if (top.Py < 0) {
            this.GlobalOffset.y = top.Py
        }
        const GO = { topY: top.Py, leftX: left.Px }
        return GO
    }

    topIDs(models = this.bpModels) {
        const ids = [] as string[]
        models.forEach(m => m.OffPos.Py === this.findTopAndLeftOffset().topY ? ids.push(m.id) : ids)
        return ids
    }
    applyGlobalOffset(models = this.bpModels) {
        const off = models.map(m => {
            m.Pos.y -= this.GlobalOffset.y
            m.Pos.x -= this.GlobalOffset.x
            return m
        });
        this.bpModels = off
        // this.HandleUpdate()
    }
}


export class BlueprintModel {
    id: string;
    Pos: ICoords; // координаты нулевой точки на чертеже
    Size: { w: number; h: number; };

    // offset?: ICoords //сдвиг из предыдущей модели
    constructor(w: number, h: number, Pos = { x: 0, y: 0 }) {
        this.Pos = Pos;
        this.Size = { w, h };
        this.id = _ID();
    }

    appendAsSize(w: number, h: number) {
        return (side: ISide) => new BlueprintModel(w, h, this.PositionOffset(side, { w, h }));
    }

    PositionOffset(side: ISide, Size: { w: number, h: number }) {
        const offsetPosRight = {
            x: this.Pos.x + this.Size.w,
            y: this.Pos.y
        };
        const offsetPosLeft = {
            x: this.Pos.x - Size.w,
            y: this.Pos.y
        };
        const offsetPosBot = {
            x: this.Pos.x,
            y: this.Pos.y + this.Size.h
        };
        const offsetPosTop = {
            x: this.Pos.x,
            y: this.Pos.y - Size.h
        };

        const offsetPosition = {
            right: offsetPosRight,
            left: offsetPosLeft,
            top: offsetPosTop,
            bot: offsetPosBot
        };

        return offsetPosition[side];
    }
    get offset() {
        return {
            x: this.Pos.x + this.Size.w,
            y: this.Pos.y + this.Size.h,
        };
    }
    get OffPos() {
        return {
            Px: this.Pos.x,
            Py: this.Pos.y,
            Ox: this.Pos.x + this.Size.w,
            Oy: this.Pos.y + this.Size.h,
        };
    }

    isLastTop(TopID: string,) {
        return this.id === TopID
    }
}

