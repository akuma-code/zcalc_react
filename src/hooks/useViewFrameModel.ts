import React, { useState, useMemo, useEffect } from 'react'
import { IHFramesSet, IViewFrame } from "../Components/Constructor/FramesSet";
import { FramePreset } from "../Components/Constructor/FramePreset";
import { IFrame } from '../Components/Constructor/FramesSet';
import { useUtils } from "./useUtils";


const viewConstPreset = {
    "id": "0000",
    "title": "view_preset",
    "VFSets": [FramePreset.THREE_ONE, FramePreset.TWO]
} as IHFramesSet



const _ID = useUtils.stringID

export function useViewFrameModel(viewmodel: IHFramesSet) {
    const [HFrameStack, setHFrameStack] = useState(viewmodel)
    const NewViewFrame = (vf_id: string, f_id = _ID()): IViewFrame => ({
        "isSelected": true,
        "id": vf_id,
        "title": "SINGLE",
        "frames": [
            {
                "id": f_id,
                "rows": [
                    {
                        "row_id": _ID(),
                        "cols": 1
                    }
                ],
                "frCode": "1"
            },
        ]
    })
    const NewVStack = () => NewViewFrame(_ID(), _ID())

    const newmodel = { id: _ID(), title: "new", VFSets: [NewVStack()] } as IHFramesSet
    const newTop = () => ({ "id": _ID(), "rows": [{ "row_id": _ID(), "cols": 1 }], "frCode": "1" }) as IFrame


    const DeleteViewFrame = (view_frame_id: string) => setHFrameStack((prev) => ({ ...prev, VFSets: prev?.VFSets.filter(fs => fs.id !== view_frame_id) }))
    const AddViewFrameRight = () => setHFrameStack((prev) => ({ ...prev, VFSets: [...prev?.VFSets, NewVStack()] }))
    const RemLastViewFrame = () => setHFrameStack((prev) => ({ ...prev, VFSets: prev.VFSets.filter((vf, idx) => idx !== prev.VFSets.length - 1) }))
    const CreateViewFrame = () => setHFrameStack(newmodel)
    const ClearFrames = () => setHFrameStack((prev) => ({ ...prev, VFSets: [] }))


    const AddViewFrameTop = (vfs_id: string) => setHFrameStack(p => ({
        ...p, VFSets: p.VFSets.map(vf => vf.id === vfs_id ?
            ({ ...vf, frames: [...vf.frames, newTop()] })
            :
            vf
        )
    }))
    const RemLastViewFrameTop = (vfs_id: string) => setHFrameStack(p => ({
        ...p, VFSets: p.VFSets.map(vf => vf.id === vfs_id ?
            ({ ...vf, frames: vf.frames.filter((f, idx) => idx !== vf.frames.length - 1) })
            :
            vf
        )
    }))
    const RemFrame = (frameset_id: string) => (frame_id: string) => setHFrameStack(p => ({
        ...p, VFSets: p.VFSets.map(vf => vf.id === frameset_id ?
            ({ ...vf, frames: vf.frames.filter((f) => f.id !== frame_id) })
            :
            vf
        )
    }))



    const FrameModelControls = { CreateViewFrame, AddViewFrameRight, RemLastViewFrame, DeleteViewFrame, ClearFrames, AddViewFrameTop, RemLastViewFrameTop, RemFrame }

    // useEffect(() => {
    //     setHFrameStack(viewmodel)
    // }, [viewmodel])


    return [HFrameStack, FrameModelControls] as const
}



export const _getSet = (getKey: string, setKey: string, transform: Function) => (obj: any) => ({ ...obj, [setKey]: transform(obj[getKey]), });