import { ISideStateValues } from "./CalcModuleTypes";

export enum ProfileVekaEnum {
    'Proline' = 'Пролайн',
    'Softline' = 'СофтЛайн',
    'Softline82' = 'СофтЛайн82',
    'Euroline' = 'ЕвроЛайн',
    'WHS60' = 'ВХС 60',
    'WHS72' = 'ВХС 72',
    // 'Proline232' = 'Пролайн.232',
    // 'Softline232' = 'СофтЛайн.232',
}

export const enum ProfileAluplast {
    'Basic' = 'Базовый Плюс',
    'Lux' = 'Люкс',
    'Optima' = 'Оптима',
    'Classic' = 'Классик',
}

export enum BorderDescEnum {
    'rama' = 'рама',
    'imp' = 'импост',
    'stv_imp' = 'створка-импост',
    'stv_rama' = 'створка-рама',
    "imp_shtulp" = 'штульп-импост',
    'svet' = 'свет',
    'porog' = 'Порог',
    'imp_in_stv' = 'импост в створке',

}

export enum DIR {
    'vertical', 'horisontal'
}
export enum DIRECTION {
    VERT = 'vertical',
    HOR = 'horisontal'
}
export enum EnSides {
    'top', 'bot', 'left', 'right'
}

export enum EnPorfileSystem {
    'Proline',
    'Softline'
}

export enum OPPOSITEenum {
    left = 'right',
    right = 'left',
    top = 'bottom',
    bottom = 'top'
}

export enum StateConvertEnum {
    rama = 'imp',
    stv_rama = 'stv_imp',
    shtulp_imp = 'imp'

}

export const STATE_BORDER_WIDTHS: Partial<Record<ISideStateValues, number>> = {
    'imp': 6,
    'rama': 10,
    'stv_imp': 12,
    'stv_rama': 18
}

export const JOIN_SIDE_STATE: Record<ISideStateValues, ISideStateValues> = {
    rama: 'stv_rama',
    imp: 'stv_imp',
    imp_shtulp: 'imp',
    stv_imp: 'imp',
    stv_rama: 'stv_rama',
    svet: 'svet'

}

export enum SIDE_NEXT {
    top = 'right',
    right = 'bottom',
    bottom = 'left',
    left = 'top',
}
export enum SIDE_PREV {
    top = 'left',
    right = 'top',
    bottom = 'right',
    left = 'bottom',
}