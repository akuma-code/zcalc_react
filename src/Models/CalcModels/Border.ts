import { ICoords, IModelDelta, IProfileDelta, ISideStateValues, IStates } from "../../Types/CalcModuleTypes"
import { BorderDescEnum, DIRECTION } from "../../Types/Enums"
import { useUtils } from "../../hooks/useUtils"
import { CalcNode_v2 } from "./CalcNode.v2"
import { EndPoint } from "./EndPoint"
import { getBorderSideByEndPoint } from "./HelperFns"


type Instance = InstanceType<typeof Border>
export class Border {
    id: string
    endPoints!: EndPoint
    state: ISideStateValues
    desc: BorderDescEnum

    constructor(state: ISideStateValues) {
        this.id = useUtils.stringID()
        this.state = state
        this.desc = BorderDescEnum[this.state]
    }
    convertTo(new_state: ISideStateValues) {
        const newItem = {
            rama: new Rama(),
            imp: new Impost()
        }
        // if (!Object.keys(newItem).includes(new_state)) return this
        const newState = newItem[new_state as keyof typeof newItem]
        this.setState(newState.state)
        // console.log('newState', newState)
        return this
    }
    private setState(new_state: ISideStateValues) {
        this.state = new_state
        this.desc = BorderDescEnum[new_state]
        return this
    }
    setEndPoints(start: ICoords, end: ICoords) {
        this.endPoints = new EndPoint(start, end)
        return this
    }

    get direction() {
        if (!this.endPoints) throw new Error("EndPoints not defined");

        const [x, y, ox, oy] = this.endPoints.start.concat(this.endPoints?.end)
        if (x === ox && y !== oy) return DIRECTION.VERT
        else return DIRECTION.HOR
    }

    set direction(dir) {
        this.direction = dir
    }
}




type RamStates = keyof Pick<IProfileDelta, 'stv_rama' | 'svet' | 'rama'>
export class Rama extends Border {

    constructor(type_state?: RamStates) {
        super(type_state ? type_state : 'rama')

    }

    createAnotherModel() {
        throw new Error("Function not ready!");

    }
}



type ImpStates = keyof Pick<IProfileDelta, 'stv_imp' | 'imp_shtulp' | 'imp'>
export class Impost extends Border {

    constructor(type_state?: ImpStates) {
        super(type_state ? type_state : 'imp')
    }


}



export const FixBorderPreset = {
    FixBorders: {
        bottom: new Rama(),
        left: new Rama(),
        right: new Rama(),
        top: new Rama(),
    },
    LN_Borders: {
        bottom: new Rama(),
        left: new Rama(),
        right: new Impost(),
        top: new Rama(),
    },
    RN_Borders: {
        bottom: new Rama(),
        left: new Impost(),
        right: new Rama(),
        top: new Rama(),
    },
    TN_Borders: {
        bottom: new Impost(),
        left: new Rama(),
        right: new Rama(),
        top: new Rama(),
    },
    BN_Borders: {
        bottom: new Rama(),
        left: new Rama(),
        right: new Rama(),
        top: new Impost(),
    },

}

