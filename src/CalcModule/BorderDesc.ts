import { IProfileSystem, IBorderState } from "./GlassDelta";
import { IDict } from "../Types/CalcModuleTypes";



export function BorderDesc(constName: IBorderState[IProfileSystem]) {
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
