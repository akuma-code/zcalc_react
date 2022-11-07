import React from 'react'
import { ConstructorMain } from '../Components/Constructor/ConstructorMain'
import { ConstructorMainRedux } from '../Components/Constructor/ConstructorMainRedux'


type HomePageProps = {
    children?: React.ReactNode
}


export const Homepage: React.FC<HomePageProps> = () => {



    return (
        <div className='container  flex m-1 p-3 bg-[#d6d6d6]'>
            <ConstructorMainRedux />

        </div>
    )
}
