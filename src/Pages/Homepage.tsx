import React, { useEffect, useState } from 'react'
import { ConstructorMain } from '../_testing_scripts/ConstructorMain'
import { ConstructorMainRedux } from '../Components/Constructor/ConstructorMainRedux'
import { FramesLibrary } from '../Components/FramesLibrary/FramesLibrary'
import { ConstructorUI } from '../Components/OffsetConstructor/index'
import { CalcForm } from '../CalcModule/Calc_Form'
import { CalcOutput } from '../CalcModule/Calc_Output'
import { IProfileSystem, IBorderState } from '../CalcModule/GlassDelta'
import { ISide } from '../Types/FrameTypes'
import { CalcFormBorderExport, ISideStateValues } from '../Types/CalcModuleTypes'


type HomePageProps = {
    children?: React.ReactNode
}


export const Homepage: React.FC<HomePageProps> = () => {

    const [calcForm, setCalcForm] = useState<CalcFormBorderExport | null>(null)
    function extractFormData(data: CalcFormBorderExport) { setCalcForm(prev => ({ ...prev, ...data })) }


    // const glass = useGlassCalculator(calcForm, calcForm.system as IProfileSystem)
    useEffect(() => {

    }, [])
    return (
        <div className='container  flex m-1 p-3 bg-[#d6d6d6]'>
            {/* <ConstructorMainRedux /> */}
            {/* <ConstructorUI /> */}
            {/* <FramesLibrary /> */}
            <CalcForm getFormData={extractFormData} />
            {calcForm && <CalcOutput incomingData={calcForm} />}
        </div>
    )
}

