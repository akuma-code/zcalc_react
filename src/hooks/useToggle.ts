import React, { useState } from 'react'



export const useToggle = (initState?: boolean) => {
    const [flag, setFlag] = useState(initState || false)

    const setOn = () => setFlag(true)
    const setOff = () => setFlag(false)
    const setToggle = () => setFlag(prev => !prev)

    const controller = {
        ON: setOn,
        OFF: setOff,
        Tgl: setToggle
    }
    return [flag, controller] as const
}