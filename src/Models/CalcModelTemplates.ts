import { INodeBorder } from "../Types/CalcModuleTypes"
import { BORDER } from "../Types/Enums"
import { CalcNode } from "./CalcModels"


const fixBorders: INodeBorder[] = [
    { side: "bot", state: "rama", desc: BORDER.rama },
    { side: "top", state: "rama", desc: BORDER.rama },
    { side: "left", state: "rama", desc: BORDER.rama },
    { side: "right", state: "rama", desc: BORDER.rama },
]
const stvBorders: INodeBorder[] = [
    { side: "bot", state: "stv_rama", desc: BORDER.stv_rama },
    { side: "top", state: "stv_rama", desc: BORDER.stv_rama },
    { side: "left", state: "stv_rama", desc: BORDER.stv_rama },
    { side: "right", state: "stv_rama", desc: BORDER.stv_rama },
]

export const fixNode = (size: { w: number, h: number }) => new CalcNode({ nodeSize: size, POS: { x: 0, y: 0 } }, fixBorders)
export const stvNode = (size: { w: number, h: number }) => new CalcNode({ nodeSize: size, POS: { x: 0, y: 0 } }, stvBorders)