import React, { useState, useEffect, useContext, HTMLAttributes, FC } from 'react'
import { ModelActions, ConstructState, ActionsType } from "../Types/ReducerTypes";


const initialState: ConstructState = {
    models: []
}

export const useModelReducer = (state: typeof initialState, action: ModelActions) => {
    switch (action.type) {
        case ActionsType.ADD_NODE:
            return {}

        default:
            return state
    }
}