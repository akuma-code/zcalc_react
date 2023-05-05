import { INodeBorder, ISizeWH } from "../../Types/CalcModuleTypes"
import { BorderDescEnum } from "../../Types/Enums"
import { CalcModel } from "./CalcModel.v1"
import { CalcNode } from "../CalcModels/CalcNode"
import { Impost, Rama } from "./Border"


const fixBorders: INodeBorder[] = [
    { side: "bot", state: "rama", desc: BorderDescEnum.rama },
    { side: "top", state: "rama", desc: BorderDescEnum.rama },
    { side: "left", state: "rama", desc: BorderDescEnum.rama },
    { side: "right", state: "rama", desc: BorderDescEnum.rama },
]
const stvBorders: INodeBorder[] = [
    { side: "bot", state: "stv_rama", desc: BorderDescEnum.stv_rama },
    { side: "top", state: "stv_rama", desc: BorderDescEnum.stv_rama },
    { side: "left", state: "stv_rama", desc: BorderDescEnum.stv_rama },
    { side: "right", state: "stv_rama", desc: BorderDescEnum.stv_rama },
]

const fixNode = (size: { w: number, h: number }) => new CalcNode().initBorders(fixBorders).initSize(size)
const stvNode = (size: { w: number, h: number }) => new CalcNode().initBorders(stvBorders).initSize(size)

export const EmptyBorders: INodeBorder[] = [
    { side: "top" },
    { side: "right" },
    { side: "bot" },
    { side: "left" },

]

export const TemplateModel = {
    Fix: (size: ISizeWH) => new CalcModel('Proline').setNodes([fixNode(size)]).setSize(size),
    Stv: (size: ISizeWH) => new CalcModel('Proline').setNodes([stvNode(size)]).setSize(size),
    DoubleFixStv: (size: ISizeWH) => new CalcModel('Proline').setNodes([fixNode(size), stvNode(size)]).setSize(size),
}
export const TemplateNode = {
    fix: fixNode,
    stv: stvNode
}
export const TemplateBorders = {
    fix: fixBorders,
    stv: stvBorders,
}

