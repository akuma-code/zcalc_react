import { ICoords } from "../../Types/CalcModuleTypes";
import { DIR, DIRECTION } from "../../Types/Enums";
import { isEqualCoordsStartEnd } from "./HelperFns";

export class EndPoint_old {
    start: ICoords
    end: ICoords
    constructor(...args: [ICoords, ICoords]) {
        this.start = args[0]
        this.end = args[1]
    }

    isEqualTo(endPoint: EndPoint_old) {
        const isSameStart = isEqualCoordsStartEnd(this.start, endPoint.start)
        const isSameEnd = isEqualCoordsStartEnd(this.end, endPoint.end)
        if (isSameStart && isSameEnd) return true
        else return false
    }

    // set direction(value: DIRECTION) {
    //     this.direction = value
    // }

    // get direction() {
    //     const [x, y, ox, oy] = this.start.concat(this.end)
    //     if (x === ox && y !== oy) return DIRECTION.VERT
    //     else return DIRECTION.HOR
    // }
}