import React, { createRef } from 'react'
import { useToggle } from '../../hooks/useToggle'

type MenuProps = {
    children?: React.ReactNode
    defaultOpen?: boolean
}

const ModalMenu = ({ defaultOpen = false }: MenuProps) => {
    const [onOpen, setMenu] = useToggle(defaultOpen)
    const MElement = createRef<HTMLOListElement>()

    return (
        <div>
            {onOpen &&
                <ol>
                    <li>menu option1</li>
                    <li>menu option2</li>
                </ol>
            }
        </div>
    )
}

export default ModalMenu