import React, { useEffect, useRef } from 'react'
import { ColoredButton } from './ColoredButton'
import { useToggle } from '../../hooks/useToggle'
import { IDataNode } from '../../Types/DataModelTypes'
import { _ID } from '../Constructor/ViewModel/ViewModelConst'
import { useStyle } from './useStyle'



type ModalProps = {
    title: string,
    onConfirmFn?: () => void
    onCancelFN?: () => void
    isOpen?: boolean
    children?: React.ReactNode
}

export const ModalCreate: React.FC<ModalProps> = ({ title, children, isOpen = false, onCancelFN, onConfirmFn }) => {
    const [show, setIsVisible] = useToggle(isOpen)
    // const [isVisible, setIsVisible] = useState(isOpen)
    const [prop, setOverflow] = useStyle('overflow')
    const btnRef = useRef<HTMLButtonElement>(null)
    const onClick = () => {

        setIsVisible.Tgl()
        btnRef.current && btnRef.current.blur()
    }
    const onConfirm = () => typeof onConfirmFn === 'function' ? onConfirmFn() : setIsVisible.OFF

    const onCancel = () => typeof onCancelFN === 'function' ? onCancelFN() : setIsVisible.OFF

    const onKeyDown = ({ key }: { key: string }) => {
        switch (key) {
            case 'Escape':
                return onCancel()
            case 'Enter':
                return onConfirm()
            default:
                return
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
        }
    })

    useEffect(
        () => show ? setOverflow('hidden') : setOverflow('auto'),
        // eslint-disable-next-line
        [show]
    )

    return (
        <div className='flex flex-row gap-4  border-black w-max h-max p-4'>
            <div className=''>
                <ColoredButton label={show ? 'Отмена' : title} onClickFn={onClick} ref={btnRef} className='bg-blue-300' />
            </div>

            {show &&
                <div className='flex flex-row gap-4 '>
                    {children}
                </div>
            }

        </div>
    )
}

