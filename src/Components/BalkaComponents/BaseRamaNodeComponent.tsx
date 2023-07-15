import React from 'react'
import { BaseRamaNode } from '../../Models/BalkaModel/BalkaModelActions'
import { IBalka, IBalkaBaseNode, InnerCoords, InnerCoordsKeys, SvgCoords, SvgCoordsKeys } from '../../Models/BalkaModel/InterfaceBalkaModels'
import { _log } from '../../hooks/useUtils'

type BaseRamaNodeProps = {
    model: IBalkaBaseNode
}

export const BaseRamaNodeComponent = (props: BaseRamaNodeProps) => {
    const { model } = props
    const { content, svg_coords } = model
    const scale_inner_coords = (obj: IBalka['position'], scale_rate = 1) => Object.entries(obj).reduce((coords, [k, v]) => {
        const key = k as InnerCoordsKeys
        coords[key] = v * scale_rate
        return coords
    }, {} as InnerCoords)
    const updatedContent = content.map(b => ({ ...b, position: scale_inner_coords(b.position) }))
    const vb = `${svg_coords.x} ${svg_coords.y} ${svg_coords.ox} ${svg_coords.oy}`

    return (
        <svg viewBox={vb} xmlns="http://www.w3.org/2000/svg"
            width={svg_coords.ox - svg_coords.x}
            height={svg_coords.oy - svg_coords.y}
        >
            <g strokeWidth={'2em'} stroke={'#000'} >

                {
                    updatedContent.map(b =>
                        <line key={b.id} {...b.position} className='cursor-pointer hover:stroke-red-400' onClick={() => _log(b.id)} />
                    )
                }
            </g>

        </svg>
    )
}