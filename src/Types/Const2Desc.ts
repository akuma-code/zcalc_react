import { IProfileSystem, ISideState } from "../CalcModule/GlassDelta";
import { IDict } from "./CalcModuleTypes";



export function Const2Desc(constName: ISideState[IProfileSystem]) {
    const desc: IDict<string> = {
        'rama': 'рама',
        'imp': 'импост',
        'stv_imp': 'створка-импост',
        'stv_rama': 'створка-рама',
        "imp_shtulp": 'штульп-импост',
        'svet': 'Свет',
        'porog': 'порог'
    } as const;
    return desc[constName];
}
