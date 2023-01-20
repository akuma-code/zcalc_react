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
    maxX() {
        const models = this.bpModels;
        models.sort((a, b) => {
            const offA = a.Pos.x + a.Size.w;
            const offB = b.Pos.x + b.Size.w;
            return offA - offB;
        });
        return models[models.length - 1]?.id;
    }

    offsetMap(models: BlueprintModel[]) {
        const off = models.map(m => m.offset);
        return off;
    }

    OPMap() {
        const mdls = [...this.bpModels]
        if (mdls.length === 0) return console.log('NO MODELS!');

        return [...this.bpModels].map(m => m.OffPos)
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
        return (side: ISide) => new BlueprintModel(w, h, this.PositionOffset(side));
    }

    PositionOffset(side: ISide) {
        const offsetRight = { x: this.Pos.x + this.Size.w, y: this.Pos.y };
        const offsetLeft = { x: this.Pos.x - this.Size.w, y: this.Pos.y };
        const offsetBot = { x: this.Pos.x, y: this.Pos.y + this.Size.h };
        const offsetTop = { x: this.Pos.x, y: this.Pos.y - this.Size.h };

        const offsetPosition = {
            right: offsetRight,
            left: offsetLeft,
            top: offsetTop,
            bot: offsetBot
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
}

