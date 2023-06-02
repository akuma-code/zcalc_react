import React, { PropsWithChildren, useReducer, useEffect } from 'react'
import { IDataBorder, IDataModel, IDataNode } from '../../../Types/DataModelTypes'
import { NotNullOBJ } from '../../../Types/CalcModuleTypes'
import StyledButton from '../../UI/StyledButton'
import { useDataModelContext } from '../../../Context/DataModelContext'
import { EDMC_ACTION } from '../Store/Interfaces/DM_ConstructorActions'
import { DM_DATA, ENUM_DM_ACTIONS, dataModelReducer } from '../Store/Reducers/DM_ModelReducer'
import { DIRECTION } from '../../../Types/Enums'
import { _log } from '../../../hooks/useUtils'

type SelectedItemViewProps = {
    variant: 'node' | 'border' | 'none'
    item?: IDataBorder | IDataNode | NotNullOBJ
    model?: IDataModel | NotNullOBJ
} & PropsWithChildren
type ViewNodeCardProps = {

}

type ViewModelControlCardProps = {
    model: IDataModel | null
}
export const SelectedItemView = (props: SelectedItemViewProps) => {

    if (props.variant === 'none') return <div className='text-center text-2xl text-red-700 p-4'>Ничего не выбрано!</div>
    return (
        <div className='flex gap-2 flex-row'>

            {props.children}
            <div>variant: {props.variant}</div>
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
    const resizeModel = () => {
        if (!DMC_Data.selected?.model_id) return
        dispatch({
            type: EDMC_ACTION.RESIZE_MODEL,
            payload: {
                model_id: DMC_Data.selected.model_id,
                new_size: { w: 250 }
            }
        })
    }
    return (
        <div className='flex gap-4'>
            {
                <div className='flex flex-col gap-4 w-max'>

                    <StyledButton label={`Добавить вертикальный импост`} onClick={() => devideVertFn()} disabled={isDis} />
                    <StyledButton label={`Добавить горизонтальный импост`} onClick={() => devideHorFn()} disabled={isDis} />
                    <StyledButton label={`Изменить размер модели`} onClick={() => resizeModel()} disabled={isDis} />
                </div>
            }
        </div>
    )

}

SelectedItemView.ViewModelControlCard = ViewModelControlCard
SelectedItemView.NodeCard = ViewNodeCard