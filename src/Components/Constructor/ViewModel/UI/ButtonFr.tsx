import React, { HTMLAttributes } from 'react'

type FrameButtonProps = {
    logo?: React.ReactNode
    bgColor: 'teal' | 'red' | 'green' | 'blue'
    clickFn: (e?: React.MouseEvent) => void
} & HTMLAttributes<HTMLButtonElement>

const ButtonFr: React.FC<FrameButtonProps> = ({ logo, bgColor, clickFn }) => {
    const bgc = {

        teal: '#08629e',
        green: '#078747',
        red: '#df1111',
        blue: '#2165f8'


    }


    return (
        <button className={`
        bg-[${bgc[bgColor]}]
        p-1
        m-1
        rounded-md
        border-[#8a8a8a] ring-2 ring-slate-800 ring-offset-1
        
        `}
            onClick={clickFn}
        >
            {logo}
        </button>
    )
}

export default ButtonFr