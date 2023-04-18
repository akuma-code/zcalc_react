import { INodeBorder, ISizeWH } from "../../Types/CalcModuleTypes"
import { BORDER } from "../../Types/Enums"
import { CalcModel } from "../CalcModels/CalcModels"
import { CalcNode } from "../CalcModels/CalcNode"


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

const fixNode = (size: { w: number, h: number }) => new CalcNode({ NSize: size, POS: { x: 0, y: 0 } }, fixBorders)
const stvNode = (size: { w: number, h: number }) => new CalcNode({ NSize: size, POS: { x: 0, y: 0 } }, stvBorders)

export const EmptyBorders: INodeBorder[] = [
    { side: "top" },
    { side: "right" },
    { side: "bot" },
    { side: "left" },

]

export const TemplateModel = {
    Fix: (size: ISizeWH) => new CalcModel('Proline', size).setNodes([fixNode(size)]),
    Stv: (size: ISizeWH) => new CalcModel('Proline', size).setNodes([stvNode(size)]),
    DoubleFixStv: (size: ISizeWH) => new CalcModel('Proline', size).setNodes([fixNode(size), stvNode(size)]),
}
export const TemplateNode = {
    fix: fixNode,
    stv: stvNode
}
export const TemplateBorders = {
    fix: fixBorders,
    stv: stvBorders,
}