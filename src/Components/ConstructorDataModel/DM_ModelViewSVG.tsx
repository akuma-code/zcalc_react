import React from 'react'
import { IDataModel } from '../../Types/DataModelTypes'
import { ISides } from '../../Types/CalcModuleTypes'

type ViewModelSvgProps = {
    data_model: IDataModel
}

export const DMViewModelSVG = ({ data_model }: ViewModelSvgProps) => {
    const { id, nodes, size, coords } = data_model
    const style = `min-h-[${size.w}em] min-w-[${size.w}em] bg-lime-300`

    return (
        <div className={style}>

            <svg xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                // width={`10em`}
                // height={`10em`}
                color='red'
                viewBox="0 0 160 160"
                strokeWidth={2}
            // transform='scale(16)'
            >

                {FixNodeSVG()}
            </svg>
        </div>
    )


}


function FixNodeSVG() {
    return <g stroke='none'
        transform='scale(.16)'
        className=' ___BASE NODE___ bg-red-500'
        width={1000} height={1000} fill='white'
    >
        <rect x={0} y={0} fill='white' width={100} height={1000} className='hover:cursor-pointer hover:bg-opacity-50 hover:fill-green-600 hover:z-50' />
        <rect x={900} y={0} fill='white' width={100} height={1000} className='hover:cursor-pointer hover:bg-opacity-50 hover:fill-green-600 hover:z-50' />
        <rect x={0} y={900} fill='white' width={1000} height={100} className='hover:cursor-pointer hover:bg-opacity-50 hover:fill-green-600 hover:z-50' />
        <rect x={0} y={0} fill='white' width={1000} height={100} className='hover:cursor-pointer hover:bg-opacity-50 hover:fill-green-600 hover:z-50' />
        <rect x={90} y={90} width={810} height={810} stroke='black' fill='lightblue' className='hover:cursor-pointer hover:fill-red-50'></rect>

    </g>
}

type SvgBorderProps = {
    size: { width: number, height: number }
    coords: { x: number, y: number }
    side: ISides
    onClick: (...args: any) => void
}


const SvgBorder = React.forwardRef((props: SvgBorderProps, ref) => {
    const { coords, side, size, onClick } = props

    const onClickFn = () => {
        onClick(side, coords)
    }
    return (<rect {...coords} onClick={onClickFn} />)
})