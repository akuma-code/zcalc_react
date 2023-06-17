import React, { PropsWithChildren, createRef } from 'react'
import { useToggle } from '../../hooks/useToggle'

type MenuProps = {
    defaultOpen?: boolean
    options?: {
        label: string
        callback: () => void
    }[]
} & PropsWithChildren


const ModalMenu = ({ defaultOpen = false, options }: MenuProps) => {
    const [onOpen, setMenu] = useToggle(defaultOpen)
    const refreshModel = () => {
        setMenu.OFF()
    }

    return (

        <div className="relative inline-block text-left border-2 rounded-md max-w-fit">
            <TriggerButton clickFn={setMenu.Tgl} />

            {
                onOpen &&
                <div
                    className="absolute left-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5"

                >
                    <div className="py-1 " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options && options.map((o, idx) =>
                            <MenuOption {...o} key={idx} />
                        )}
                        {/* <MenuOption label='Refresh Model' onClickFn={refreshModel} />
                        <MenuOption label='show info' onClickFn={refreshModel} /> */}

                    </div>
                </div>
            }
        </div>

    )
}

export default ModalMenu

type MenuOptionProps = {
    label?: string
    onClickFn?: () => void
}
const MenuOption = (props: MenuOptionProps) => {
    const { label, onClickFn } = props
    return (
        <div onClick={onClickFn}
            className="block px-4 py-2 text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600" role="menuitem">

            <span className="flex flex-col cursor-pointer">
                <span>
                    {label && label}
                </span>
            </span>
        </div>)
}
type TriggerButtonProps = {
    clickFn: () => void
}
function TriggerButton({ clickFn }: TriggerButtonProps) {
    return <div className='max-w-[3em] bg-stone-500 rounded-md'>
        <button type="button"
            className={`flex items-center justify-center w-full
                     rounded-md  px-1 py-1 text-sm font-medium
                    text-gray-700 dark:text-gray-50
                   hover:bg-gray-50 dark:hover:bg-gray-500
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500`} id="options-menu"
            onClick={clickFn}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
            </svg>
        </button>
    </div>
}


