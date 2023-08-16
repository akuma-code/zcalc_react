import { InnerCoords } from "../Models/BalkaModel/InterfaceBalkaModels"
import { WithPositionProp } from "./LinkedItems"
export type NextConsumeCoordsKeys = keyof Pick<InnerCoords, 'x1' | 'y1'>
export type PrevConsumeCoordsKeys = keyof Pick<InnerCoords, 'x2' | 'y2'>


export interface ILinkedCoords<T extends InnerCoords> {
    shared_coords: InnerCoords | null
    sync: (data: T) => void

}

export interface Observer<T> {
    notify: (data: T) => void
}

class LinkedCoordsStore<T extends WithPositionProp> {
    public shared_coords!: InnerCoords | null

    constructor(public data: T) {
        this.shared_coords = data.pos
    }
}