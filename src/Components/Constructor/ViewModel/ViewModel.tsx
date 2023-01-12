/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react'
import { useHookContext } from '../../../Context/HookModelCTX'
import { useUtils } from '../../../hooks/useUtils'
import { DataFrame, DataRow, DataVFrameSet, DataNode } from '../../../Models/DataModel'
import { ConstructionModel } from '../../../Models/WinFrameHookModel'
import { DivProps, RFC } from '../../../Types'
import { IFrameNode, IFrameRow } from '../../../Types/ModelsTypes'
import { RRN } from '../../../Types'
import { Frame } from './ViewFrame'
import { RowFactory } from './RowFactory'
import { FramesStackProps, IHFramesSet } from '../../../Types/ViewmodelTypes'




export const _ID = useUtils.stringID


export const ConstructionViewModel: React.FC<IHFramesSet> = (VModel) => {
    const { editInfo: current, setInfo: setCurrent, setVM } = useHookContext()
    const { VFSets } = VModel || []
    const selectFrame = (fs_id: string, f_id: string) => {

        return setCurrent && setCurrent((prev: any) => ({
            ...prev,
            selectedFrame: f_id,
            selectedFrameSet: fs_id,
            isEditing: true,
        }))
    }

    const ViewModelMemed = useMemo(() =>
        VFSets?.map((fs) =>
            <VStack key={fs.id} >
                {
                    fs.frames.map((f) => (
                        <Frame
                            id={f.id}
                            rows={f.rows}
                            key={f.id}
                            isSelected={f.id === current.selectedFrame}
                            onClickFn={() => selectFrame(fs.id, f.id)}
                            data={{ frames: new DataFrame(f.rows, f.id), id: f.id, rows: f.rows }}
                        />
                    ))
                }
            </VStack>

        ), [VFSets, selectFrame])




    if (!VFSets || VFSets.length === 0) return (<div>
        <h2>Конструктор пуст!</h2>
    </div>)


    return (
        <HStack align='top'>
            {
                ViewModelMemed
            }
        </HStack>
    )
}
const VStack: React.FC<FramesStackProps> = ({ children, className, data }) => {
    const cls = 'flex flex-col-reverse border-collapse ' + className
    return (
        <div className={cls}>
            {children}
        </div>
    )
}
const HStack: React.FC<FramesStackProps> = ({ children, className, align = 'top' }) => {
    const frameAlign = {
        top: "items-start",
        mid: "items-center",
        bot: "items-end",
    } as const
    const cls = (classes?: string) => `flex devide-x-8  ${classes} ${frameAlign[align]}`

    return (
        <div className={cls(className)}>
            {children}
        </div>
    )
}


export const RF = new RowFactory()
