import { _sideCoords } from "../Components/ConstructorDataModel/Store/actions/NodeExtractor"
import { NodeManager } from "../Components/ConstructorDataModel/Store/actions/NodeManager"
import { inferR } from "../Models/BalkaModel/BalkaModels"
import { InnerCoords } from "../Models/BalkaModel/InterfaceBalkaModels"
import { Size } from "../Models/CalcModels/Size"
import { Point } from "../Models/PointsModel/Point"
import { IPoint } from "../Models/PointsModel/PointInterface"
import { _log } from "../hooks/useUtils"
import { ISideStateValues, ISides } from "./CalcModuleTypes"
import { CoordsTuple, IDataBorder, IDataNode } from "./DataModelTypes"
import { BorderDescEnum } from "./Enums"

type GetReturnType<Type> = Type extends (...args: never[]) => infer Return ? Return : never


export type DTO_BorderSide = {
    border_id: string
    side: ISides
    state: ISideStateValues
    axisCoord?: CoordsTuple
}

export type DTO_Node = {
    node_id: string
    coords: CoordsTuple
    size: Size
    borders: DTO_BorderSide[]
}

export interface IChainList_DTO {
    dto_point: {
        point?: { x: number, y: number }
        counter?: number
    }

    dto_border: {
        pos: InnerCoords
        id: string
        counter?: number
    }
}

function convertBorderToDto(border: IDataBorder) {
    const { id, side, state } = border
    const dto: DTO_BorderSide = {

        border_id: id,
        side,
        state
    }
    return dto
}

function convertNodeToDto(node: IDataNode) {
    const { id, borders, coords, size } = node
    if (!borders || !coords || !size) {
        _log("Node convert fail!")
        throw new Error("no required data")
    }
    const sideCoords = _sideCoords(coords)
    const dto_bs = borders
        .map(convertBorderToDto)
        .map(bs => ({ ...bs, axisCoord: sideCoords[bs.side] }))

    const dto: DTO_Node = {
        node_id: id,
        borders: dto_bs,
        coords,
        size
    }
    return dto
}

function convertDtoToBorder(dto_bs: DTO_BorderSide) {
    const border: IDataBorder = {
        id: dto_bs.border_id,
        desc: BorderDescEnum[dto_bs.state],
        ...dto_bs
    }
    return border
}

function convertDtoToNode(dto_node: DTO_Node) {
    const bs = dto_node.borders.map(convertDtoToBorder)

    const node: IDataNode = {
        id: dto_node.node_id,
        borders: bs,
        coords: dto_node.coords,
        size: dto_node.size
    }
    return NodeManager.initNode(node)
}

const dto_Convert = {
    border_dto: convertBorderToDto,
    dto_border: convertDtoToBorder,
    node_dto: convertNodeToDto,
    dto_node: convertDtoToNode
}

export default dto_Convert