import React, { useContext } from "react";
import { DMC_Data } from "../Components/ConstructorDataModel/Store/Reducers/DM_ConstructorReducer";
import { DMC_Actions_List } from "../Components/ConstructorDataModel/Store/Interfaces/DM_ConstructorActions";


type IDataModelContext = {
    info: string,
    model_size: { width: number, height: number },
    DMC_Data: DMC_Data,
    DMC_Action: (value: DMC_Actions_List) => void
}

export const DataModelContext = React.createContext<IDataModelContext | null>(null)

export function useDataModelContext() {
    const context = useContext(DataModelContext)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}

