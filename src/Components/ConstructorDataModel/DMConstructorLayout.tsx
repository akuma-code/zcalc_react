import React, { useState, HTMLAttributes, useReducer, useEffect, useRef } from 'react'
import { DataModelContext } from '../../Context/DataModelContext'
import { ModalCreate } from '../CmConstructor/ModalCreate'
import { ColoredButton } from '../CmConstructor/ColoredButton'
import { _log } from '../../hooks/useUtils'
import { useToggle } from '../../hooks/useToggle'
import { SizeForm } from './SizeForm'
import { IDataBorder, IDataModel, IDataNode } from '../../Types/DataModelTypes'
import { NotNullOBJ } from '../../Types/CalcModuleTypes'
import { NodeCreator } from '../../Models/CalcModels/BorderFactory'
import { BorderDescEnum } from '../../Types/Enums'
import { DMC_Data, DM_ConstructorReducer } from './Store/Reducers/DM_ConstructorReducer'
import { DMC_ACTION } from './Store/actions/DM_ConstructorActions'
import { DataModelView, setStyle } from '../CmConstructor/DataModelView'
import { useStyle } from '../../hooks/useStyle'




const initState: DMC_Data = {
    modelGroup: [] as IDataModel[],
    selectedItem: {} as SelectedItemVariants
}
const NLeft = NodeCreator('fix', 6, 12)
const NMid = NodeCreator('fix', 3, 12, 6, 0)
const NRight = NodeCreator('fix', 6, 12, 9, 0)

type SelectedItemVariants = IDataModel | IDataNode | IDataBorder | NotNullOBJ
type ConstructorProps = {}



//TODO: States для разных вариантов выбранного элемента, типа рама, импост нода и т.п.
export const DMConstructorLayout = (props: ConstructorProps) => {
    const [newModelForm, setNewModelForm] = useState({ width: 0, height: 0 })
    const [showForm, setShowForm] = useState(false)
    const [showProps, setShowProps] = useState(false)
    const [DMC_DATA, DMC_dispatch] = useReducer(DM_ConstructorReducer, initState)
    const layoutRef = useRef<HTMLDivElement | null>(null)
    const [marginBot, setMarginBot] = useState(0)
    const [canvas, setCanvas] = useState({ h: 35, mb: 0 })

    const onCreateModel = () => {
        // const [ w, h ] =[  newModelForm.width, newModelForm.height ]
        // DMC_dispatch({ type: DMC_ACTION.CREATE, payload: { w, h, x: 0, y: 0 } })

        setShowForm(prev => !prev)

    }
    const onSelect = (item: DMC_Data['selectedItem']) => {

        _log("Selected: ", item)
    }
    useEffect(() => {
        const models = DMC_DATA.modelGroup
        const maxH = models.map(m => m.size.h).reduce((H, mh) => {
            H = mh

            return H

        }, 0)
        setCanvas(prev => ({ ...prev, h: maxH, mb: 35 - maxH }))
        // const canvasDiv = layoutRef.current
        // const canvasH = canvasDiv ? getComputedStyle(canvasDiv).getPropertyValue('height') : "NONONO"
        // console.log('maxH', canvas.h)
        // console.log('marginBot', canvas.mb)
        // _log(canvasH)
    }, [DMC_DATA.modelGroup])


    return (
        <DataModelContext.Provider value={{
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
                        <SizeForm onAccept={onCreateModel} />
                    </ModalWrapElement>

                    <ModalWrapElement
                        isVisible={showProps}
                        setVisible={setShowProps}
                        label='Create Props'
                    >
                        <fieldset className='flex flex-col gap-4 px-2  border-2 border-slate-800 p-4 justify-items-start'>
                            <legend>Props</legend>
                            Some props that not ready yet
                        </fieldset>
                    </ModalWrapElement>
                </GridLayoutItem>


                <GridLayoutItem type='selected'>

                </GridLayoutItem>


                <GridLayoutItem type='canvas' className='p-3 ' >

                    {/* <div className="relative mb-[3em]" ref={layoutRef}> */}
                    <ModelGroupCanvas ref={layoutRef} >

                        {
                            DMC_DATA.modelGroup.map(model =>
                                <DataModelView data_model={model} key={model.id} />)
                        }
                    </ModelGroupCanvas>

                    {/* </div> */}
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
        <div className={` relative min-h-[${props.divH || 20}em]`}>

            {props.children}
        </div>
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
