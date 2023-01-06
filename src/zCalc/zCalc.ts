import { IFramez, IFrameState, IFrameType } from "../Types/FrameTypes"
import { fixframeF } from "./MockData";


function Convert() {

    const toSTV = (value: IFrameType) => {
        switch (value) {
            case 'rama':
                value = 'stv_rama'
                break;
            case 'imp':
                value = 'stv-imp'
                break;
            case 'fix':
                value = 'stv'
                break;
            case 'shtulp':
                value = 'stv'
                break;
            default: return value
        }
        return value
    }

    const toFix = (value: IFrameType) => {
        switch (value) {
            case 'stv_rama':
                value = 'rama'
                break;
            case 'stv_imp':
                value = 'imp'
                break;
            case 'shtulp_imp':
                value = 'imp'
                break;
            case 'stv':
                value = 'fix'
                break;
            case 'shtulp':
                value = 'fix'
                break;
            default: return value
        }
        return value
    }

    const toShtulp = (value: IFrameType) => {
        switch (value) {
            case 'rama':
                value = 'stv_rama'
                break;
            case 'stv_imp':
                value = 'shtulp_imp'
                break;
            case 'imp':
                value = 'shtulp_imp'
                break;
            case 'fix':
                value = 'shtulp'
                break;
            case 'stv':
                value = 'shtulp'
                break;
            default: return value
        }
        return value
    }

    const result = (frame: IFramez, cb: (value: string) => void) =>
        Object.entries(frame).reduce((obj, [k, v]) => ({ ...obj, [k]: cb(v) }), {})
    const setS = result(fixframeF, toFix)
    const STV = (frame: IFramez) => Object.entries(frame).reduce((obj, [k, v]) => ({ ...obj, [k]: toSTV(v) }), {})
    const FIX = (frame: IFramez) => Object.entries(frame).reduce((obj, [k, v]) => ({ ...obj, [k]: toFix(v) }), {})
    const SHTULP = (frame: IFramez) => Object.entries(frame).reduce((obj, [k, v]) => ({ ...obj, [k]: toShtulp(v) }), {})
    return { STV, FIX, SHTULP }

}

export const setSTV = Convert().STV
export const setFIX = Convert().FIX
export const setShtulp = Convert().SHTULP