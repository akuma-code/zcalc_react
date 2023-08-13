import React, { useState, HTMLAttributes, useReducer, useEffect, useRef } from 'react'
import { DataModelContext } from '../../Context/DataModelContext'
import { ModalCreate } from '../CmConstructor/ModalCreate'
import { ColoredButton } from '../CmConstructor/ColoredButton'
import { _log } from '../../hooks/useUtils'
import { useToggle } from '../../hooks/useToggle'
import { SizeForm } from './SizeForm'
import { IDataBorder, IDataModel, IDataNode, IResizeDataModel } from '../../Types/DataModelTypes'
import { NotNullOBJ } from '../../Types/CalcModuleTypes'
import { NodeCreator } from "./Store/actions/DM_Creators"
import { BorderDescEnum } from '../../Types/Enums'
import { DMC_Data, DM_ConstructorReducer } from './Store/Reducers/DM_ConstructorReducer'
import { EDMC_ACTION } from './Store/Interfaces/DM_ConstructorActions'
import { DataModelView, setStyle } from '../CmConstructor/DataModelView'
import { useStyle } from '../CmConstructor/useStyle'
import { SquareSVG, SquareSVG2, SquareSVG3 } from '../SVG/SquareSVG'
import { DMResizeViewModelSVG } from './DM_ModelViewSVG'
import { SelectedItemView } from './SelectedItemView/SelectedItemView'
import { dataModelReducer } from './Store/Reducers/DM_ModelReducer'
import { initConstructorData } from '../CmConstructor/store/reducers/ConstructorReducer'
import StyledButton from '../UI/StyledButton'
import { ResizeForm } from './SelectedItemView/ResizeForm'
import { Size } from '../../Models/CalcModels/Size'
import ModalMenu from '../UI/ModalMenu'
import { BaseRamaNode } from '../../Models/BalkaModel/BalkaModels'
import { IBalkaBaseNode, InnerCoords } from '../../Models/BalkaModel/InterfaceBalkaModels'
import { BaseRamaNodeComponent } from '../BalkaComponents/BaseRamaNodeComponent'

//* потом стереть
// import { LL } from '../../CommonFns/LinkedList'
// const c1: InnerCoords = { x1: 0, y1: 0, x2: 10, y2: 10 }
// const c2: InnerCoords = { x1: 10, y1: 10, x2: 20, y2: 20 }
// const c3: InnerCoords = { x1: 20, y1: 20, x2: 30, y2: 30 }

// LL.insertInBegin(c1)
// LL.insertAtEnd(c2)
// LL.insertAtEnd(c3)
// _log(LL.size())
// _log(LL)

type SelectedItemVariants = IDataModel | IDataNode | IDataBorder | NotNullOBJ

const initState: DMC_Data = {
    modelGroup: [] as IResizeDataModel[],
    selectedItem: {} as SelectedItemVariants,
    selectedModel: {} as IResizeDataModel,
    selected: { variant: 'none' } as DMC_Data['selected']
}
const NLeft = NodeCreator('fix', 6, 12)
const NMid = NodeCreator('fix', 3, 12, 6, 0)
const NRight = NodeCreator('fix', 6, 12, 9, 0)


type ConstructorProps = {}



//TODO: States для разных вариантов выбранного элемента, типа рама, импост нода и т.п.
export const DMConstructorLayout = (props: ConstructorProps) => {
    const [newModelForm, setNewModelForm] = useState({ width: 0, height: 0 })
    const [balkaModels, setBalkaModels] = useState([] as IBalkaBaseNode[])
    // const [highlight, setHighlight] = useState<string[]>([])
    const [showForm, setShowForm] = useState(false)
    const [showFormResize, viewResize] = useState(false)
    const [DMC_DATA, DMC_dispatch] = useReducer(DM_ConstructorReducer, initState)
    const layoutRef = useRef<HTMLDivElement | null>(null)
    const resizeModelFn = (new_size: Size) => {
        if (!DMC_DATA.selected?.model_id) return
        const { w, h } = new_size
        DMC_dispatch({
            type: EDMC_ACTION.RESIZE_MODEL,
            payload: {
                model_id: DMC_DATA.selected.model_id,
                new_size: { w, h }
            }
        })
    }

    const onCreateModel = (new_size: Size) => {
        const S = new Size(new_size.w, new_size.h)
        const pl = { ...S, x: 0, y: 0 }
        DMC_dispatch({
            type: EDMC_ACTION.CREATE,
            payload: pl
        })
        setNewModelForm(prev => ({ ...prev, width: new_size.w, height: new_size.h }))
        if (newModelForm.height !== 0 || newModelForm.width !== 0) setBalkaModels(prev => [...prev, new BaseRamaNode(new_size)])
        setShowForm(prev => !prev)

    }
    const onRefreshCb = () => {
        DMC_DATA.selectedModel?.primeNode.size && onCreateModel(DMC_DATA.selectedModel?.primeNode.size)

    }

    const varSelect = DMC_DATA.selected?.variant ? DMC_DATA.selected.variant : 'none'

    return (
        <DataModelContext.Provider value={{
            // highlithedIDs: highlight,
            // setHL: setHighlight,
            info: 'create_form',
            model_size: newModelForm,
            DMC_Data: DMC_DATA,
            DMC_Action: DMC_dispatch


        }}>

            <GridLayout grid={{ cols: 4, rows: 4 }} >

                <GridLayoutItem type='controls' className='flex-col gap-4 flex'>
                    <ModalWrapElement label='Create Model'
                        isVisible={showForm}
                        setVisible={setShowForm}>
                        <SizeForm getNewSize={onCreateModel} onClose={() => setShowForm(false)} />
                    </ModalWrapElement>

                    <ModalWrapElement
                        isVisible={showFormResize}
                        setVisible={viewResize}
                        label='ResizeModel'
                    >
                        {DMC_DATA.selected?.model_id && <ResizeForm
                            initsize={DMC_DATA.selectedModel?.primeNode.size!}
                            onClose={() => viewResize(false)}
                            getNewSize={resizeModelFn}

                        />}
                    </ModalWrapElement>
                    <ModalMenu options={[{ label: 'refresh', callback: onRefreshCb }]} />
                </GridLayoutItem>


                <GridLayoutItem type='selected' className='container p-2 flex-col gap-4 flex'>
                    <SelectedItemView variant={varSelect} item={DMC_DATA.selectedItem} >
                        {/* <SelectedItemView.NodeCard /> */}
                        {DMC_DATA.selectedModel && <SelectedItemView.ViewModelControlCard model={DMC_DATA.selectedModel || null} />}
                    </SelectedItemView>

                </GridLayoutItem>


                <GridLayoutItem type='canvas' className='p-3 ' >

                    <ModelGroupCanvas ref={layoutRef} >
                        <div className='container'>
                            {/* {
                                DMC_DATA.modelGroup.map(model =>

                                    <DMViewModelSVG data_model={model} key={model.id} />)
                            } */}

                            {/* {
                                DMC_DATA.modelGroup &&
                                DMC_DATA.modelGroup.map(model =>
                                    <DMResizeViewModelSVG
                                        baseNode={model.primeNode!}
                                        coords={model.primeNode?.coords!}
                                        id={model.id}
                                        nodes={model.nodes}
                                        key={model.id}

                                    />
                                )
                            } */}
                            {balkaModels && balkaModels.map(b =>
                                <BaseRamaNodeComponent model={b} key={b.id} />
                            )}

                        </div>
                    </ModelGroupCanvas>

                </GridLayoutItem>

            </GridLayout>
        </DataModelContext.Provider>
    )
}

type GroupCanvasProps = {
    children?: React.ReactNode
    mb?: number
    divH?: number
}
const ModelGroupCanvas = React.forwardRef((props: GroupCanvasProps, ref: React.ForwardedRef<HTMLDivElement>) => {

    return <div className={`    MODELS_GROUP    `} ref={ref}>

        {props.children}
    </div>
})

type GridControlsItemProps = {
    isVisible?: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    label: string
    children?: React.ReactNode
}
const ModalWrapElement: React.FC<GridControlsItemProps> = ({ isVisible, children, label, setVisible }: GridControlsItemProps) => {
    return (
        <div className='flex flex-col gap-4'>
            {isVisible && children}

            <ColoredButton
                onClickFn={() => setVisible(prev => !prev)}
                label={isVisible ? 'Close' : label} />

        </div>
    )
}


type GridLayoutProps = {
    children?: React.ReactNode
    grid?: { cols: number, rows: number }
} & HTMLAttributes<HTMLDivElement>

const GridLayout: React.FC<GridLayoutProps> = ({ grid = { cols: 4, rows: 4 }, children }) => {
    const gridStyle = `grid grid-cols-${grid.cols} grid-rows-${grid.rows}`
    const viewStyle = `gap-2`

    return <div className={setStyle(gridStyle, viewStyle)}>
        {children}
    </div>
}
type LayoutItemProps = {
    type: 'selected' | 'controls' | 'canvas'
    className?: string
    children?: React.ReactNode
}
const GridLayoutItem: React.FC<LayoutItemProps> = ({ type, className, children, }: LayoutItemProps) => {
    const styletype = {
        selected: ' col-start-2 col-end-5 row-start-1 bg-blue-300 col-span-full ',
        canvas: 'col-start-2 col-end-5 row-start-2 bg-blue-200 row-span-full',
        controls: 'col-start-1 col-end-2  row-span-full bg-green-300 p-2 ',
    }

    const style = className ? `${styletype[type]} ${className} ` : `${styletype[type]} `
    return (
        <div className={style}>
            {children}
        </div>
    )
}

