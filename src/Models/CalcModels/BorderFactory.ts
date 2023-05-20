import { _ID } from "../../Components/Constructor/ViewModel/ViewModelConst";
import { IDataBorder, CoordsTuple } from "../../Types/DataModelTypes";
import { BorderDescEnum } from "../../Types/Enums";

class BorderFactory {
    library!: Record<string, IDataBorder[]>
    constructor() {
        this.library = {}
    }

    use(key: string, borders: IDataBorder[]) {
        this.library[key] = borders
        return this
    }


    load(key: keyof typeof this.library) {
        return this.library[key]
    }
    get info() {
        return console.log(this);

    }
}


const fixBorderPack: IDataBorder[] = [
    { id: _ID(), side: 'left', desc: BorderDescEnum['rama'], state: 'rama' },
    { id: _ID(), side: 'top', desc: BorderDescEnum['rama'], state: 'rama' },
    { id: _ID(), side: 'right', desc: BorderDescEnum['rama'], state: 'rama' },
    { id: _ID(), side: 'bottom', desc: BorderDescEnum['rama'], state: 'rama' },
]
const stvBorderPack: IDataBorder[] = [
    { id: _ID(), side: 'left', desc: BorderDescEnum['stv_rama'], state: 'stv_rama' },
    { id: _ID(), side: 'top', desc: BorderDescEnum['stv_rama'], state: 'stv_rama' },
    { id: _ID(), side: 'right', desc: BorderDescEnum['stv_rama'], state: 'stv_rama' },
    { id: _ID(), side: 'bottom', desc: BorderDescEnum['stv_rama'], state: 'stv_rama' },
]


export const BF = new BorderFactory()

BF.use('fix', fixBorderPack)
BF.use('stv', stvBorderPack)

const setCoords = (borders: IDataBorder[], ...coords: CoordsTuple) => {
    return borders.map(b => ({ ...b, coords: coords }))

}
export default BF