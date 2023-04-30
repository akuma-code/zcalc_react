import { ICoords, IModelDelta, IProfileDelta, ISideStateValues, IStates } from "../../Types/CalcModuleTypes"
import { BORDER } from "../../Types/Enums"
import { useUtils } from "../../hooks/useUtils"

export class Border {
    id: string
    endPoints?: { start: ICoords, end: ICoords }
    state: ISideStateValues
    desc: BORDER
    constructor(state: ISideStateValues) {
        this.id = useUtils.stringID()
        this.state = state
        this.desc = BORDER[this.state]
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
        this.desc = BORDER[new_state]
        return this
    }
    setEndPoints(start: ICoords, end: ICoords) {
        this.endPoints = { ...this.endPoints, start, end }


        return this
    }
}

type RamStates = keyof Pick<IProfileDelta, 'stv_rama' | 'svet'>
export class Rama extends Border {

    constructor(type_state?: RamStates) {
        super(type_state ? type_state : 'rama')

    }

    createAnotherModel() {
        throw new Error("Function not ready!");

    }
}
type ImpStates = keyof Pick<IProfileDelta, 'stv_imp' | 'imp_shtulp'>
export class Impost extends Border {

    constructor(type_state?: ImpStates) {
        super(type_state ? type_state : 'imp')


    }

    joinNodes() {
        console.log('Join Nodes!')
    }
}