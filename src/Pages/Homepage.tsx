import React, { useEffect, useState } from 'react'
import { ConstructorMain } from '../_testing_scripts/ConstructorMain'
import { ConstructorMainRedux } from '../Components/Constructor/ConstructorMainRedux'
import { FramesLibrary } from '../Components/FramesLibrary/FramesLibrary'
import { ConstructorUI } from '../Components/OffsetConstructor/index'
import { CalcForm, CalcFormDataExport } from '../CalcModule/Calc_Form'
import { CalcOutput } from '../CalcModule/Calc_Output'
import { IProfileSystem, ISideState } from '../CalcModule/GlassDelta'
import { ISide } from '../Types/FrameTypes'
import { ISideStateValues } from '../Types/CalcModuleTypes'


type HomePageProps = {
    children?: React.ReactNode
}


export const Homepage: React.FC<HomePageProps> = () => {

    const [calcForm, setCalcForm] = useState<CalcFormDataExport<string> | null>(null)
    function extractFormData(data: CalcFormDataExport<string>) { setCalcForm(prev => ({ ...prev, ...data })) }


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

