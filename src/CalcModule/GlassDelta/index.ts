import { Euroline } from "./Euroline";
import { Proline } from "./Proline";
import { Softline } from "./Softline";
import { Softline82 } from "./Softline82";
import { WHS72 } from "./WHS72";
import { WHS60 } from './WHS60'


const GlassDelta = { Euroline, Proline, Softline, Softline82, WHS72, WHS60 }


type IGlassDelta = typeof GlassDelta
export type IProfileSystem = keyof IGlassDelta
export type PickSideState<T> = {
    [Property in keyof T]: keyof T[Property]
}

export type IBorderState = PickSideState<IGlassDelta>

export default GlassDelta

