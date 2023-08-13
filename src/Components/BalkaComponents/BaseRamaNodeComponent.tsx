import { IBalka, IBalkaBaseNode, InnerCoords, InnerCoordsKeys, SvgCoords } from '../../Models/BalkaModel/InterfaceBalkaModels'
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
            <g strokeWidth={5} fill='white' stroke={'#000'} >

                {
                    updatedContent.map(b =>
                        <g key={b.id}>

                            <line  {...b.position} className='cursor-pointer hover:stroke-red-400' onClick={() => _log(b.id)} />
                        </g>
                    )
                }
            </g>
            {glass_rect(svg_coords)}

        </svg>
    )
}

const glass_rect = (coords: SvgCoords) => {

    const applyOffset = (svg_coords: SvgCoords, offset: { ofx: number, ofy: number }) => {
        const applyed: SvgCoords = { ...svg_coords, x: svg_coords.x + offset.ofx, y: svg_coords.y + offset.ofy, ox: svg_coords.ox - offset.ofx, oy: svg_coords.oy - offset.ofy, }
        return applyed
    }
    const offset = { ofx: 10, ofy: 10 }
    const gls_coords = applyOffset(coords, offset)

    const rectProps = {
        width: gls_coords.ox - gls_coords.x,
        height: gls_coords.oy - gls_coords.y,
        x: gls_coords.x,
        y: gls_coords.y
    }

    return <rect {...rectProps} className='fill-cyan-400 hover:fill-cyan-900' />
}