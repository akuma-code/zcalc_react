import React, { PropsWithChildren, useReducer, useEffect, useRef } from 'react'
import { IDataBorder, IDataModel, IDataNode, IResizeDataModel } from '../../../Types/DataModelTypes'
import { NotNullOBJ } from '../../../Types/CalcModuleTypes'
import StyledButton from '../../UI/StyledButton'
import { useDataModelContext } from '../../../Context/DataModelContext'
import { EDMC_ACTION } from '../Store/Interfaces/DM_ConstructorActions'
import { DM_DATA, ENUM_DM_ACTIONS, dataModelReducer } from '../Store/Reducers/DM_ModelReducer'
import { DIRECTION } from '../../../Types/Enums'
import { _log } from '../../../hooks/useUtils'
import { useToggle } from '../../../hooks/useToggle'
import { Size } from '../../../Models/CalcModels/Size'
import { ResizeForm } from './ResizeForm'

type SelectedItemViewProps = {
    variant: 'node' | 'border' | 'none'
    item?: IDataBorder | IDataNode | NotNullOBJ
    model?: IDataModel | NotNullOBJ
} & PropsWithChildren
type ViewNodeCardProps = {

}

type ViewModelControlCardProps = {
    model: IResizeDataModel | null
}
export const SelectedItemView = (props: SelectedItemViewProps) => {

    if (props.variant === 'none') return <div className='text-center text-2xl text-red-700 p-4'>Ничего не выбрано!</div>
    return (
        <div className='flex gap-2 flex-row'>

            {props.children}
            {/* <div>variant: {props.variant}</div> */}
        </div>
    )
}


export const ViewNodeCard = (props: ViewNodeCardProps) => {
    const { DMC_Data: data, DMC_Action: dispatch } = useDataModelContext()

    const item = data.selectedItem
    const clickFn = (id: string) => {

    }
    return (
        <div>
            <StyledButton label={`Devide`} onClick={() => { }} />
        </div>
    )
}

export const ViewModelControlCard = (props: ViewModelControlCardProps) => {
    const [showInput, setState] = useToggle(false)
    const wRef = useRef<React.HTMLAttributes<HTMLInputElement> | null>(null)
    const hRef = useRef<React.HTMLAttributes<HTMLInputElement> | null>(null)
    const { DMC_Data, DMC_Action: dispatch } = useDataModelContext()

    const isDis = !DMC_Data.selected?.model_id || !DMC_Data.selected?.node_id
    const devideVertFn = () => {
        if (!DMC_Data.selected?.model_id || !DMC_Data.selected?.node_id) return
        dispatch({
            type: EDMC_ACTION.NODE_DEVIDE,
            payload: {
                model_id: DMC_Data.selected?.model_id,
                node_id: DMC_Data.selected?.node_id,
                dir: DIRECTION.VERT
            }
        })
    }
    const devideHorFn = () => {
        if (!DMC_Data.selected?.model_id || !DMC_Data.selected?.node_id) return
        dispatch({
            type: EDMC_ACTION.NODE_DEVIDE,
            payload: {
                model_id: DMC_Data.selected?.model_id,
                node_id: DMC_Data.selected?.node_id,
                dir: DIRECTION.HOR
            }
        })
    }
    const resizeModel = (new_size: Size) => {
        if (!DMC_Data.selected?.model_id) return
        const { w, h } = new_size
        dispatch({
            type: EDMC_ACTION.RESIZE_MODEL,
            payload: {
                model_id: DMC_Data.selected.model_id,
                new_size: { w, h }
            }
        })
    }
    const deleteImpost = () => {
        dispatch({
            type: EDMC_ACTION.DELETE_IMPOST
        })
    }
    const selectedM = DMC_Data.modelGroup.find(m => m.id === props.model?.id)!
    const initform = {
        w: selectedM?.primeNode.size?.w!,
        h: selectedM?.primeNode.size?.h!,

    }


    return (
        <div className='flex gap-4'>

            <div className='flex flex-col gap-4 w-max'>

                <StyledButton label={`Добавить вертикальный импост`} onClick={() => devideVertFn()} disabled={isDis} />
                <StyledButton label={`Добавить горизонтальный импост`} onClick={() => devideHorFn()} disabled={isDis} />
                <StyledButton label={`Удалить импост`} onClick={deleteImpost} disabled={isDis} />

            </div>
            <div className='flex gap-4 flex-col'>
                <StyledButton label={!showInput ? `Изменить размер модели` : `Закрыть`} onClick={setState.Tgl} disabled={true} />
                {
                    // showInput &&

                    // <ResizeForm initsize={initform} getNewSize={resizeModel} onClose={setState.OFF} />
                }
            </div>
        </div>
    )

}
SelectedItemView.ViewModelControlCard = ViewModelControlCard
SelectedItemView.NodeCard = ViewNodeCard
SelectedItemView.ResizeForm = ResizeForm