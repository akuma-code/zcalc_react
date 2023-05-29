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
            <div> </div>
            <div>variant: {props.variant}</div>
            {props.children}
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
    const initData: DM_DATA = {
        model_id: props.model?.id || "",
        coords: props.model?.coords! || [0, 0, 0, 0],
        nodes: props.model?.nodes || [],
        size: props.model?.size || { w: 0, h: 0 }

    }
    const [DM_DATA, DM_dispatch] = useReducer(dataModelReducer, initData)
    const devideVertFn = (id?: string) => {
        if (!id) return
        _log(id)
        DMC_Data.selected?.variant === 'node' ? DM_dispatch({
            type: ENUM_DM_ACTIONS.DEVIDE_NODE,
            payload: { node_id: id, dir: DIRECTION.VERT }
        }) :
            dispatch({
                type: EDMC_ACTION.UPDATE,
                payload: { ...DM_DATA }
            })

    }
    const devideHorFn = (id?: string) => {
        if (!id) return
        DM_dispatch({
            type: ENUM_DM_ACTIONS.DEVIDE_NODE,
            payload: { node_id: id, dir: DIRECTION.HOR }
        })
        props.model?.id && dispatch({
            type: EDMC_ACTION.UPDATE,
            payload: { coords: DM_DATA.coords, nodes: DM_DATA.nodes, size: DM_DATA.size, model_id: DM_DATA.model_id }
        })
    }

    useEffect(() => {

        dispatch({
            type: EDMC_ACTION.UPDATE,
            payload: { ...DM_DATA }
        })
        _log("updated selected!")

    }, [dispatch, DM_DATA, props.model, DMC_Data.selectedModel])
    return (
        <div className='flex gap-4'>
            {DMC_Data.selected?.node_id &&
                <div>

                    <StyledButton label={`Добавить вертикальный импост`} onClick={() => devideVertFn(DMC_Data.selected?.node_id)} />
                    <StyledButton label={`Добавить горизонтальный импост`} onClick={() => devideHorFn(DMC_Data.selected?.node_id)} />
                </div>
            }
        </div>
    )

}

SelectedItemView.ViewModelControlCard = ViewModelControlCard
SelectedItemView.NodeCard = ViewNodeCard