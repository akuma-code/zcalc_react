import { CM_Node } from "../Types/CalcModuleTypes";
import GlassDelta, { IProfileSystem, IBorderState } from "./GlassDelta";


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
    state: "fix",
    system: "Proline"
}

