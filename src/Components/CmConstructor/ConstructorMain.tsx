import React, { useState } from 'react'
import { ModelView } from './ModelView'
import { CalcModel_v2 } from '../../Models/CalcModels/CalcModel.v2'

type ConstructorMainProps = {

}

const ConstructorMainCalcModel = (props: ConstructorMainProps) => {
    const [cmodel, setCmodel] = useState<CalcModel_v2 | null>(null)
    return (
        <div>
            <div>
                {cmodel && <ModelView calc_model={cmodel} />}
            </div>
        </div>
    )
}

export default ConstructorMainCalcModel

