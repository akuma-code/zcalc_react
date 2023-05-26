import React, { PropsWithChildren } from 'react'
import { IDataBorder, IDataNode } from '../../../Types/DataModelTypes'
import { NotNullOBJ } from '../../../Types/CalcModuleTypes'

type SelectedItemViewProps = {
    variant: 'node' | 'border' | 'none'
    item?: IDataBorder | IDataNode | NotNullOBJ
} & PropsWithChildren
type ViewNodeCardProps = {

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



    return (
        <div>ViewNodeCard</div>
    )
}

SelectedItemView.NodeCard = ViewNodeCard