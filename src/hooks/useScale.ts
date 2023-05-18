import { Size } from "../Models/CalcModels/Size"
import { CoordsTuple } from "../Types/DataModelTypes"
import { _log } from "./useUtils"

export const useScale = (scale: number, ...args: number[]) => {
    const scaled = args.map(n => n * scale)
    const [w, h] = scaled
    return scaled
}


const computeRateAndSize = (size: Size, passValue: number) => {
    const { w, h } = size
    const rate = h >= w ? h / w : w / h
    const result = h >= w ? { rate, newSize: new Size(passValue, passValue * rate) } : { rate, newSize: new Size(passValue * rate, passValue) }

    return result
}

const test = new Size(2, 8)

const tt = computeRateAndSize(test, 3)

_log(tt)