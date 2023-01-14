import React, { useState, useMemo } from 'react'
import { HookModelCTX } from '../../Context/HookModelCTX'
import { useUtils } from '../../hooks/useUtils'
import { useViewFrameModel } from '../../hooks/useViewFrameModel'
import { DataNode, DataRow, DataVFrameSet } from '../../Models/DataModel'
import { DivProps } from '../../Types'
import { IFrame, IHFramesSet, IVFrameSet } from '../../Types/ViewmodelTypes'
import Button from '../UI/Button'
import VM from './ViewModel/index'


const genID = useUtils.stringID

export type ViewMData = {
    id: string
}

export interface ISavedModelData {
    id: string,
    title?: string
    Hstack: { id: string, vs_id: string }[]
    Vstack: { id: string, frame_id: string }[]
    Frames: { id: string, row_id: string }[]
    Rows: { frame_id: string, id: string, col: number }[]
    Nodes: DataNode[]
}

function savedata(vm: IHFramesSet) {
    const { id, title, VFSets } = vm
    const hs = VFSets.map(vfs => ({ id, vs_id: vfs.id }))

}

export class DataViewConstruction implements IHFramesSet {
    id: string
    VFSets: IVFrameSet[]
    info?: any
    constructor(viewmodel: IHFramesSet) {
        this.id = viewmodel.id
        this.VFSets = viewmodel.VFSets
        // this.info = this.getData(viewmodel)
    }

    getData(viewmodel: IHFramesSet) {
        if (!viewmodel) return
        const SavedData = {} as ISavedModelData
        const { id, VFSets } = viewmodel
        // const nodes = (frame: IFrame[]) => frame.reduce((sum: any, node: DataNode) => {
        //     const newnode = new DataNode(node.row_id, node.id)
        //     sum.push(newnode)

        // }, [])
        const Hstack = VFSets.map(vset => ({ id: id, vs_id: vset.id }))
        const [Vstack] = VFSets.map(vset => vset.frames.map(fr => ({ id: vset.id, frame_id: fr.id })))
        console.log({ Hstack, Vstack })
        return { Hstack, Vstack }
    }
}

export const ConstructorMainRedux = (): JSX.Element => {
    //! переделать в стейт подготовки модели к експорту
    const [exportData, setExportData] = useState<ISavedModelData | {}>({})
    const [editInfo, setInfo] = useState({})
    const [savedModels, saveModel] = useState([] as typeof ViewModel[])
    const [ViewModel, setVM] = useViewFrameModel({} as IHFramesSet)
    const [ModelData, setModelData] = useState<DataViewConstruction | {}>(new DataViewConstruction(ViewModel))


    const SAVE = (view_model: IHFramesSet) => {
        // if (savedModels.every(m => m.id !== view_model.id)) saveModel(prep => ([...prep, view_model]))
        // else saveModel(m => m.map(vm => vm.id === view_model.id ? ({ ...vm, ...view_model }) : vm))
        setModelData(view_model)
        console.log('view_model', view_model)
        console.log('saved: ', ModelData)
        return

    }
    const reset = () => {
        setVM.ClearFrames()
        console.clear()
    }

    const SideControlButtons = useMemo(() => (
        <div className='bg-orange-800 flex flex-col divide-y px-2'>
            <h3 className='text-2xl'>Control Panel</h3>
            <button
                className="h-14 px-4 my-2 font-semibold rounded-md bg-cyan-600 text-white
                            active:bg-blue-50 active:text-black"
                onClick={setVM.CreateViewFrame}
            >Новое изделие
            </button>
            <Button bg='#11b434'
                onClickFn={() => SAVE(ViewModel)}
            >
                Сохранить
            </Button>
            <Button bg='#2b2206'
                onClickFn={() => setVM.LoadViewModel(savedModels[0])}
            >
                Загрузить последнее
            </Button>

            <button
                className="h-10 px-6 my-2 font-semibold rounded-md bg-blue-800 text-white
                            active:bg-blue-50 active:text-black"
                onClick={reset}
            >Очистить конструктор
            </button>
        </div>
    ), [savedModels, ViewModel])


    return (
        <HookModelCTX.Provider
            value={{
                // FullConstruction, setFullConstruction,
                editInfo, setInfo,
                savedModels, saveModel,
                ViewModel, setVM,
                export: exportData, setExport: setExportData
            }}
        >


            <div className='flex-col text-center m-1'>
                <b className="text-4xl">Конструктор</b>
                <div className='divide-x-4 columns-2 flex mt-3'>

                    {SideControlButtons}

                    <Canvas >
                        {
                            ViewModel.VFSets && ViewModel.VFSets.length >= 1 &&

                            <VM.ConstructionViewModel VFSets={ViewModel.VFSets} id={ViewModel.id} />
                        }
                    </Canvas>
                </div>
            </div>
        </HookModelCTX.Provider>
    )
}


const Canvas: React.FC<DivProps> = ({ children }) => {

    return (
        <div className='bg-orange-400 divide-y-2'>
            <span className='text-2xl p-1 m-1'>
                CanvasLayout
            </span>
            <div className='bg-slate-200  items-start flex flex-col min-h-[30em]  min-w-[30em] px-16 py-16 z-22'
            >
                {children}
            </div>
        </div>
    )
}

