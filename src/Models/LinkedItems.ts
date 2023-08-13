import { InnerCoords } from "./BalkaModel/InterfaceBalkaModels"
interface WithPositionProp { position: InnerCoords }
class LinkedItems {

}


interface ILinkedItem<T> {
    value: T
}


class LinkItem implements ILinkedItem<WithPositionProp>{
    value: WithPositionProp
    constructor(value: { position: InnerCoords }) {
        this.value = value
    }
}