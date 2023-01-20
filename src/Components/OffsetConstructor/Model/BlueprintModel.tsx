import { ISide } from "../../../Types/FrameTypes";
import { _ID } from "../../Constructor/ViewModel/ViewModelConst";
import { ICoords } from "./OffsetModel";



export class Blueprint {
    bpModels = [] as BlueprintModel[];

    HandleUpdate() {
        const BPCopy = new Blueprint();
        BPCopy.bpModels = this.bpModels;
        console.log(this.OPMap());

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

    findTop(models = this.bpModels) {
        const mds = [...models].map(m => m.OffPos)
        const top = mds.reduce((minTop, m) => m.Py < minTop.Py ? ({ ...minTop, ...m }) : minTop, { Py: 0, Px: 0, Ox: 0, Oy: 0 })
        // const top = mds.reduce((minTop, m) => {

        //     if (m.Py < minTop.Py) minTop.Py = m.Py
        //     return minTop
        // }, { Py: 0 })
        const ids = [] as string[]
        models.forEach(m => m.OffPos.Py === top.Py ? ids.push(m.id) : ids)
        return ids
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


