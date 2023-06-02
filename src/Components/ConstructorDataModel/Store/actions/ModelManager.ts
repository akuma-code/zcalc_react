import { Size } from "../../../../Models/CalcModels/Size"
import { ISides } from "../../../../Types/CalcModuleTypes";
import { CoordsTuple, IDataBorder, IDataModel, IDataNode } from "../../../../Types/DataModelTypes"
import { ISide } from "../../../../Types/FrameTypes";
import { _log } from "../../../../hooks/useUtils";
import { initModelNodes } from "./DM_Creators";
export type InitedDataModel = Required<IDataModel>
class DataModelManager {
    ResizeModel(model: IDataModel, new_size: Partial<Size>) {
        const { size, coords, baseNode } = model

        const { w: nw, h: nh } = new_size
        const aspectRatio = {
            VERT: nh ? nh / size.h : 1,
            HOR: nw ? nw / size.w : 1
        }
        const applyAspect = (node_coords: CoordsTuple) => {

            if (node_coords.length !== 4) throw new Error("Coords Error");
            const res: CoordsTuple = node_coords.map((cc, idx, arr) => {
                const nc = idx % 2 === 0 ? cc * aspectRatio.HOR : cc * aspectRatio.VERT
                return nc
            }) as unknown as CoordsTuple
            if (res.length !== 4) throw new Error("Coords Error");
            return res
        }
        if (!coords) throw new Error("Coords Error");
        const updated_size = { ...size, w: nw || size.w, h: nh || size.h }
        const [x, y, ox, oy] = coords
        const OX = x + updated_size.w
        const OY = x + updated_size.h
        // const OX = new_size.w ? x + new_size.w : x + size.w
        // const OY = new_size.h ? y + new_size.h : y + size.h
        const new_coords: CoordsTuple = [x, y, OX, OY]
        const resized: IDataModel = { ...model, coords: new_coords, size: { ...size, ...new_size } }
        _log("aspect: ", aspectRatio)
        resized.nodes = [...resized.nodes].map(n => ({
            ...n,
            coords: applyAspect(n.coords!),
            size: { w: size.w * aspectRatio.HOR, h: size.h * aspectRatio.VERT },
        }))
        const inited = initModelNodes(resized)
        const rb = findRightBotNodes(inited)

        _log("rb: ", rb)
        return inited as IDataModel
    }
}
function findRightBotNodes(data_model: Required<IDataModel>) {
    const { nodes, coords: m_coords } = data_model
    if (!m_coords) throw new Error("Coords Error");


    const getBorder = (side: ISides, borders: IDataBorder[]) => borders.find(b => b.side === side)

    const SideNodes = { right: [] as IDataNode[], bot: [] as IDataNode[], corner: {} as IDataNode }
    nodes.forEach(n => {
        const rn = getBorder('right', n.borders!)
        const bn = getBorder('bottom', n.borders!)
        if (rn?.state === 'rama') SideNodes.right.push(n)
        if (bn?.state === 'rama') SideNodes.bot.push(n)
        // if (rn?.state === 'rama' && bn?.state !== 'rama') SideNodes.right.push(n)
        // if (bn?.state === 'rama' && rn?.state !== 'rama') SideNodes.bot.push(n)
        if (bn?.state === 'rama' && rn?.state === 'rama') SideNodes.corner = { ...SideNodes.corner, ...n }
    })
    return { SideNodes }
}

const DataModelController = new DataModelManager()
export default DataModelController
