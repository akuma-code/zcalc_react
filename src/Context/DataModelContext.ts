import React, { useContext } from "react";


type IDataModelContext = {

}

export const DataModelContext = React.createContext<IDataModelContext | null>(null)

export function useDataModelContext() {
    const context = useContext(DataModelContext)
    if (!context) {
        throw new Error('Хук используется вне провайдера контекста!')
    }
    return context
}

