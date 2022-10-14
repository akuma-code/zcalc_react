import React from 'react'
import { BaseFrame } from '../Frames/BaseFrame'


type HomePageProps = {
    children?: React.ReactNode
}

export const Homepage: React.FC<HomePageProps> = () => {
    return (
        <div className='column-3 mx-1 my-1'>
            <div className="navbar">

            </div>



            <BaseFrame pos_x={0} pos_y={0} />


        </div>
    )
}
