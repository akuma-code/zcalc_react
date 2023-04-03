type ISideState = 'rama' | 'imp' | 'stv_imp' | 'stv_rama'
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