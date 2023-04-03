import { CM_Node } from "../Types/CalcModuleTypes";
import GlassDelta, { IProfileSystem, ISideState } from "./GlassDelta";


const TestNode: CM_Node = {
    id: '123',
    pos: { r: 1, c: 1 },
    sides: {
        top: "rama",
        bot: "rama",
        left: "rama",
        right: "rama",
    },
    size: { w: 500, h: 800 },
    state: "fix"
}

export function CalcGlass(system: IProfileSystem, NODE: CM_Node): { gw: number, gh: number } {

    const delta = GlassDelta[system]
    const ns = (side: keyof typeof delta) => {
        if (side in delta) return 0
        const res = delta[side]
        return res
    }
    const dw = ns(NODE.sides.left) + ns(NODE.sides.right)
    const dh = ns(NODE.sides.top) + ns(NODE.sides.bot)

    const { gw, gh } = { gw: NODE.size.w - dw, gh: NODE.size.h - dh }

    return { gw, gh }
}

