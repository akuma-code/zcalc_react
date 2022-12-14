import React, { useState, useMemo, useEffect, SetStateAction } from 'react'
import { IHFramesSet, IVFrameSet } from "../Components/Constructor/FramesSet";
import { FramePreset } from "../Components/Constructor/FramePreset";
import { IFrame } from '../Components/Constructor/FramesSet';
import { useUtils } from "./useUtils";
import { IFrameRow } from '../Types/ModelsTypes';


const viewConstPreset = {
    "id": "0000",
    "title": "view_preset",
    "VFSets": [FramePreset.THREE_ONE, FramePreset.TWO]
} as IHFramesSet
const NewViewFrame = (vf_id: string, f_id = _ID()): IVFrameSet => ({
    "isSelected": true,
    "id": vf_id,
    "frames": [
        {

            "id": f_id,
            "rows": [
                {
                    "row_id": _ID(),
                    "cols": 1
                }
            ],

        },
    ]
})


const _ID = useUtils.stringID

export function useViewFrameModel(viewmodel: IHFramesSet) {
    const [HFrameStack, setHFrameStack] = useState(viewmodel)

    const NewVStack = () => NewViewFrame(_ID(), _ID())

    const newmodel = { id: _ID(), title: "new_" + _ID(), VFSets: [NewVStack()] } as IHFramesSet
    const newTop = () => {
        const newID = _ID()
        return { "id": newID, "rows": [{ "row_id": _ID(), "cols": 1 }] } as IFrame
    }


    const DeleteViewFrame = (vf_id: string) => setHFrameStack((prev) => ({ ...prev, VFSets: prev?.VFSets.filter(fs => fs.id !== vf_id) }))
    const AddViewFrameRight = () => setHFrameStack((prev) => ({ ...prev, VFSets: [...prev?.VFSets, NewVStack()] }))
    const RemLastViewFrame = () => setHFrameStack((prev) => ({ ...prev, VFSets: prev.VFSets.filter((vf, idx) => idx !== prev.VFSets.length - 1) }))
    const CreateViewFrame = () => setHFrameStack(newmodel)
    const ClearFrames = () => setHFrameStack((prev) => ({ ...prev, VFSets: [] }))
    const LoadViewModel = (view_model: typeof HFrameStack) => setHFrameStack(prev => view_model)
    const syncFrames = (frame_id: string, newvfsets: IFrameRow[]) => setHFrameStack(p => ({
        ...p, VFSets: p.VFSets.map(vfs => ({
            ...vfs, frames: vfs.frames.map(f => f.id === frame_id ?
                ({ ...f, rows: newvfsets }) : f)
        }))
    }))
    const changeUpCols = (vfs_id: string, f_id: string, row_id: string) => setHFrameStack(vfs => ({
        ...vfs, VFSets: vfs.VFSets.map(fs => fs.id === vfs_id ? ({
            ...fs, frames: fs.frames.map(fr => fr.id === f_id ? ({
                ...fr, rows: fr.rows.map(r => r.row_id === row_id ? ({ ...r, cols: r.cols + 1 }) : r)
            }) : fr)
        }) : fs)
    }))
    const changeDownCols = (vfs_id: string, f_id: string, row_id: string) => setHFrameStack(vfs => ({
        ...vfs, VFSets: vfs.VFSets.map(fs => fs.id === vfs_id ? ({
            ...fs, frames: fs.frames.map(fr => fr.id === f_id ? ({
                ...fr, rows: fr.rows.map(r => r.row_id === row_id ? ({ ...r, cols: r.cols - 1 }) : r)
            }) : fr)
        }) : fs)
    }))
    const changeCols = (vfs_id: string, f_id: string,) => ({
        UP: (row_id: string) => changeUpCols(vfs_id, f_id, row_id),
        Down: (row_id: string) => changeDownCols(vfs_id, f_id, row_id)
    })

    const AddViewFrameTop = (vfs_id: string) => setHFrameStack(p => {

        return ({
            ...p, VFSets: p.VFSets.map(vf => vf.id === vfs_id ?
                ({ ...vf, frames: [...vf.frames, newTop()] })
                :
                vf
            )
        })
    }
    )
    const RemLastViewFrameTop = (vfs_id: string) => setHFrameStack(p => ({
        ...p, VFSets: p.VFSets.map(vf => vf.id === vfs_id ?
            ({ ...vf, frames: vf.frames.filter((f, idx) => idx !== vf.frames.length - 1) })
            :
            vf
        )
    }))
    const RemFrame = (frameset_id: string) => (frame_id: string) => setHFrameStack(p => {
        setHFrameStack(viewmodel => ({ ...viewmodel, VFSets: viewmodel.VFSets.filter(vf => vf.frames.length !== 0) }))
        return ({
            ...p, VFSets: p.VFSets.map(vf => vf.id === frameset_id ?
                ({ ...vf, frames: vf.frames.filter((f) => f.id !== frame_id) })
                :
                vf
            )
        })
    })



    const FrameModelControls = {
        CreateViewFrame,
        AddViewFrameRight,
        RemLastViewFrame,
        DeleteViewFrame,
        ClearFrames,
        AddViewFrameTop,
        RemLastViewFrameTop,
        RemFrame,
        LoadViewModel,
        syncFrames,
        setHFrameStack,
        changeCols
    }

    // useEffect(() => {
    //     setHFrameStack(viewmodel)
    // }, [viewmodel])


    return [HFrameStack, FrameModelControls] as const
}



export const _getSet = (getKey: string, setKey: string, transform: Function) => (obj: any) => ({ ...obj, [setKey]: transform(obj[getKey]), });
