import React, { useState, HTMLAttributes, useReducer, useEffect } from 'react'
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




    const onCreateModel = () => {
        const { w, h } = { w: newModelForm.width, h: newModelForm.height }
        // DMC_dispatch({ type: DMC_ACTION.CREATE, payload: { w, h, x: 0, y: 0 } })

        setShowForm(prev => !prev)
        _log(DMC_DATA)
    }
    const onSelect = (item: DMC_Data['selectedItem']) => {

        _log("Selected: ", item)
    }
    const getFormData = (data: { width: number, height: number }) => {
        setNewModelForm(prev => ({ ...data }))
    }
    useEffect(() => {
        // _log(newModelForm)
    }, [newModelForm])
    return (
        <DataModelContext.Provider value={{
            info: 'create_form',
            model_size: newModelForm,
            DMC_Data: DMC_DATA,
            DMC_Action: DMC_dispatch


        }}>

            <GridLayout grid={{ cols: 4, rows: 4 }} >

                <GridLayoutItem type='controls' className='flex-col gap-4 flex'>
                    <GridControlsItem label='Create Model'
                        isVisible={showForm}
                        setVisible={setShowForm}>
                        <SizeForm getData={getFormData} onAccept={onCreateModel} />
                    </GridControlsItem>

                    <GridControlsItem
                        isVisible={showProps}
                        setVisible={setShowProps}
                        label='Create Props'
                    >
                        <fieldset className='flex flex-col gap-4 px-2  border-2 border-slate-800 p-4 justify-items-start'>
                            <legend>Props</legend>
                            Some props that not ready yet
                        </fieldset>
                    </GridControlsItem>
                </GridLayoutItem>


                <GridLayoutItem type='selected'>

                </GridLayoutItem>


                <GridLayoutItem type='canvas'>
                    <div className='p-4'>

                        <div className='border-2 h-[25em] w-[32em] bg-red-400 flex p-2  relative  z-0'>
                            {/* <div className="absolute h-12 w-12 bg-lime-500 left-0 top-0  flex justify-center">M</div> */}
                            <div className="h-full w-full bg-white  p-4 hover:bg-slate-800 hover:text-cyan-50 z-10">
                                <div className="bg-blue-400  h-full hover:bg-slate-800 hover:text-cyan-50 z-20" onClick={() => onSelect(NLeft)}>
                                    {NLeft.id}
                                </div>
                            </div>
                            <div className="h-full w-full bg-white p-4 hover:bg-slate-800 hover:text-cyan-50 z-10">
                                <div className="bg-blue-400  h-full hover:bg-slate-800 hover:text-cyan-50 z-20" onClick={() => onSelect(NMid)}>
                                    {NMid.id}
                                </div>
                            </div>
                            <div className="h-full w-full bg-white p-4 hover:bg-slate-800 hover:text-cyan-50 z-10">
                                <div className="bg-blue-400  h-full hover:bg-slate-800 hover:text-cyan-50 z-20" onClick={() => onSelect(NRight)}>
                                    {NRight.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </GridLayoutItem>

            </GridLayout>
        </DataModelContext.Provider>
    )
}


type GridControlsItemProps = {
    isVisible?: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
    label: string
    children?: React.ReactNode
}
const GridControlsItem: React.FC<GridControlsItemProps> = ({ isVisible, children, label, setVisible }: GridControlsItemProps) => {
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
    return <div className={`grid grid-cols-4 grid-rows-4 gap-2`}>
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
        canvas: 'col-start-2 col-end-5 row-start-2 bg-blue-200 row-span-full ',
        controls: 'col-start-1 col-end-2  row-span-full bg-green-300 p-2 ',
    }

    const style = `${styletype[type]} `
    return <div className={style + className}>
        {children}
    </div>
}
