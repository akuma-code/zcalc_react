import React, { useEffect, useState } from 'react'
import { ConstRama } from '../Components/Constructor/ConstRama'
import { ConstructorMain } from '../Components/Constructor/ConstructorMain'
import { BaseFrame } from '../Frames/BaseFrame'


type HomePageProps = {
    children?: React.ReactNode
}


export const Homepage: React.FC<HomePageProps> = () => {
    const [cols, setCols] = useState(1)
    const [rows, setRows] = useState(1)
    const [frames, setFrames] = useState<JSX.Element[]>([])


    return (
        <div className='container  flex m-1 p-3 bg-[#d6d6d6]'>
            <ConstructorMain />

        </div>
    )
}
