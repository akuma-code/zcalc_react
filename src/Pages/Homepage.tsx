import React from 'react'
import { ConstructorMain } from '../_testing_scripts/ConstructorMain'
import { ConstructorMainRedux } from '../Components/Constructor/ConstructorMainRedux'
import { FramesLibrary } from '../Components/FramesLibrary/FramesLibrary'
import OFC from '../Components/OffsetConstructor/index'


type HomePageProps = {
    children?: React.ReactNode
}


export const Homepage: React.FC<HomePageProps> = () => {



    return (
        <div className='container  flex m-1 p-3 bg-[#d6d6d6]'>
            <ConstructorMainRedux />
            <OFC.ConstructorUI />
            {/* <FramesLibrary /> */}
        </div>
    )
}
