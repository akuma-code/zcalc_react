import React, { HTMLAttributes, FC } from 'react'

type ButtonIconProps = {
    children?: React.ReactNode
    onClickFn?: () => void
} & HTMLAttributes<HTMLButtonElement>

export const ButtonIcon: FC<ButtonIconProps> = (props) => {

    const { children, onClickFn, className } = props

    return (
        <button
            onClick={onClickFn}
            className={'p-2 my-2 font-semibold rounded-md bg-blue-800 text-white active:bg-blue-50 active:text-black ' + className}
        >
            {children}
        </button>
    )
}