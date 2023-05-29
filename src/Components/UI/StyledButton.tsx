import React from 'react'

type Props = {
    onClick: () => void
    label: React.ReactNode
}

const StyledButton = ({ label, onClick }: Props) => {
    return (

        <button type="button" onClick={onClick}
            className={`py-2 px-4  bg-red-600 hover:bg-red-700
  focus:ring-red-500 focus:ring-offset-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
   text-white w-full transition ease-in duration-200 text-center text-base font-semibold
    shadow-md  opacity-70 cursor-pointer rounded-lg `}>
            {label}
        </button>

    )
}

export default StyledButton