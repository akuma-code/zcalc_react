type ISideState = 'rama' | 'imp' | 'stv_imp' | 'stv_rama' | 'imp_shtulp'
type INodeState = 'stv' | 'fix' | 'shtulp' | 'stv232'
type INodePos = { r: number, c: number }
type INodeSize = { w: number, h: number }


export interface CM_Node {
    id: string
    sides: {
        top: ISideState
        bot: ISideState
        left: ISideState
        right: ISideState
    }
    state: INodeState
    pos: INodePos
    size: INodeSize

}

export function Const2Desc(constName: ISideState | string) {
    const desc = {
        'rama': 'рама',
        'imp': 'импост',
        'stv_imp': 'створка-импост',
        'stv_rama': 'створка-рама',
        "imp_shtulp": 'импост-штульп'
    }
    if (typeof constName == 'string') return constName
    return desc[constName] as ISideState
}