import React, { HTMLAttributes } from 'react'

type ButtonProps = {
    children?: React.ReactNode
    className?: string
    bg?: string
    textColor?: string
    onClickFn?: () => void
} & HTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = (props) => {

    const { children, className, bg = '#1e40af', textColor = 'white', onClickFn } = props
    const cls = [`p-2 my-2 font-semibold rounded-md bg-[${bg}] text-[${textColor}] active:bg-blue-50 active:text-black`, className].join(" ")
    return (
        <button
            className={cls}
            onClick={onClickFn}
        >
            {children}
        </button>
    )
}

export default Button