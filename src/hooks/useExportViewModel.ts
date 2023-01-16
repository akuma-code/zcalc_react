import { DataRow } from "../Models/DataModel";
import { IFrame, IHFramesSet, IVFrameSet } from "../Types/ViewmodelTypes";

export function useExportViewModel(view_model: IHFramesSet) {

    const expFrameData = (frame: IFrame, vset_id: string) => ({
        id: frame.id,
        vset_id,
        type: frame.type,
        RowIds: frame!.rows.map(r => r.row_id),
        Nodes: frame.rows.map(row => new DataRow(row.col, row.row_id).nodes)
    })

    const expHSet = (view_model: IHFramesSet) => ({
        id: view_model.id,
        VStackIds: view_model.VFSets.map(vset => vset.id),
        // Frames: view_model.VFSets.map(vset => vset.frames.map(fr => expFrameData(fr, vset.id)))
        Frames: view_model.VFSets.map(vset => vset.frames.reduce((sum: any[], fr) => {
            const frame = expFrameData(fr, vset.id)
            sum.push(frame)
            return sum
        }, []))
    })

    const exported = expHSet(view_model)
    return exported
}

