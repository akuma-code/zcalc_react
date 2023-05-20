import React from 'react'
import { Size } from '../../Models/CalcModels/Size'
import { setStyle } from '../CmConstructor/DataModelView'
import { _log } from '../../hooks/useUtils'

type Props = {
  size: Size
}

export const SquareSVG = (props: Props) => {
  const { w, h } = props.size
  const styleSize = `w-[${w}em] h-[${h}em]`
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      fill="#1089da"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className={setStyle(styleSize)}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
    </svg>

  )
}

export const SquareSVG2 = () => {


  return <svg xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width={350}
    height={350}
    // viewBox="0 0 343 343"
    strokeWidth={2}
    fill='#ad1919'
  // className='hover:bg-slate-100'
  >
    <g fill="#84d108" stroke='#10c8e0' transform='scale(1)' className='hover:bg-slate-100'>
      {/* <rect
        preserveAspectRatio='alignment'
        x="0"
        y="0"
        width={128}
        height={208}
        opacity={.5}
        fill="#dae8fc"
        stroke="#000000"
        pointerEvents="all" /> */}
      {/* <rect
        preserveAspectRatio='alignment'
        x="132"
        y="0"
        width="8em"
        height="13em"
        fill="#1b61c4"
        stroke="#000000"
        pointerEvents="all" /> */}
      <rect width="100%" height="100%" fill="red" rx={40} className='hover:cursor-pointer' />

      <circle cx="150" cy="100" r="80" fill="green" onClick={() => _log("Clicked!")} />

      <text x="150" y="125" fontSize="60" textAnchor="middle" fill="white"  >SVG</text>
    </g>
  </svg>
}




export const SquareSVG3 = () => {


  return <svg xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="100%"
    height='100%'
    viewBox="0 0 2100 1500"
    className='hover:bg-slate-900'
  >
    <g stroke='black' fill='white' strokeWidth={1} transform='scale(.7)' alignmentBaseline='auto'>
      <rect width={2100} height={1500} x={0} y={0} />
      <rect width={600} height={1400} x={100} y={50} fill='blue' />
      <rect width={600} height={1400} x={750} y={50} fill='blue' />
      <rect width={600} height={1400} x={1400} y={50} fill='blue' />
    </g>
  </svg>
}

