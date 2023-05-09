import { useState, useEffect } from "react"
type CoordsProps = readonly [number, number, number, number]
export function useNodeCoords(coords: CoordsProps, scale?: number) {
    const [x, y, ox, oy] = coords
    const [data, setData] = useState([x, y, ox - x, oy - y])
    useEffect(() => {
        scale && setData(prev => prev.map(n => n * scale))


    }, [scale])
    return data
}

