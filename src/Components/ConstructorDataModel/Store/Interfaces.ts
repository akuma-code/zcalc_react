import { IDataBorder, IDataModel, IDataNode } from "../../../Types/DataModelTypes";

export interface ISelectedItemStates {
    model: {
        data: IDataModel,
        actions: {
            resize: () => void
        }
    }

    border: {
        data: IDataBorder
        actions: {
            changeBorderState: () => void
            deleteImpost: () => void
            swapConnection: () => void
        }
    }
    node: {
        data: IDataNode
        actions: {
            changeNodeType: () => void
            devideNode: () => void
            resize: () => void
        }
    }
}