import { Size } from "../../../../Models/CalcModels/Size";
import { CoordsTuple, IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes";
import { BorderDescEnum, DIRECTION } from "../../../../Types/Enums";
import { _log } from "../../../../hooks/useUtils";
import { _ID } from "../../../Constructor/ViewModel/ViewModelConst";
import { SwapType } from "../Reducers/DM_ModelReducer";

type IDirection = DIRECTION.VERT | DIRECTION.HOR

export function DevideSVGNode(node: IDataNode, dir: IDirection): readonly [IDataNode, IDataNode] {
    const { size, coords, borders } = node
    if (!size || !coords || !borders) throw new Error("Cant Devide! No Size or coords");


    const [x, y, ox, oy] = coords!
    const newSize = {
        [DIRECTION.VERT]: { w: size!.w / 2, h: size.h },
        [DIRECTION.HOR]: { h: size!.h / 2, w: size.w },
    }
    const newCoords = {
        [DIRECTION.VERT]: {
            main: [x, y, x + (ox - x) / 2, oy] as CoordsTuple,
            second: [x + (ox - x) / 2, y, ox, oy] as CoordsTuple
        },
        [DIRECTION.HOR]: {
            main: [x, y, ox, y + (oy - y) / 2] as CoordsTuple,
            second: [x, y + (oy - y) / 2, ox, oy] as CoordsTuple
        },
    }
    const newBorder = {
        [DIRECTION.VERT]: {
            main: borders.map(b => b.side === 'right' ? { ...b, ...changeState(b), id: _ID() } : { ...b, id: _ID() }) as IDataBorder[],
            second: borders.map(b => b.side === 'left' ? { ...b, ...changeState(b), id: _ID() } : { ...b, id: _ID() }) as IDataBorder[],
        },
        [DIRECTION.HOR]: {
            main: borders.map(b => b.side === 'bottom' ? { ...b, ...changeState(b), id: _ID(), } : { ...b, id: _ID() }) as IDataBorder[],
            second: borders.map(b => b.side === 'top' ? { ...b, ...changeState(b), id: _ID(), } : { ...b, id: _ID() }) as IDataBorder[],
        }
    }
    const first = { ...node, size: newSize[dir], borders: newBorder[dir].main, id: _ID(), coords: newCoords[dir].main }
    const second = { ...node, size: newSize[dir], borders: newBorder[dir].second, id: _ID(), coords: newCoords[dir].second }
    return [first, second] as const

}

const changeState = (border: IDataBorder) => {
    const swap: SwapType = {
        rama: 'imp',
        imp: 'imp',
        imp_shtulp: 'imp',
        stv_imp: 'stv_imp',
        stv_rama: 'stv_imp',
        svet: 'svet'
    }

    const newStateDesc = { state: swap[border.state], desc: BorderDescEnum[swap[border.state]] }
    // console.log('swap', border.state, "=>", swap[border.state])
    const newBorder = { ...border, ...newStateDesc }
    return newBorder
}

const changeBorder = (borders: IDataBorder[], new_border: IDataBorder) => {
    const ns = new_border.side
    return borders.map(b => b.side === ns ? { ...b, ...new_border } : b)
}

export function resizeModel(model: IDataModel, new_size: Partial<Size>): IDataModel {

    _log("!!!")
    return model
}