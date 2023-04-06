



export function useGlassCalculator(size: { w: number, h: number }, dwdh?: { dw: number, dh: number }) {
    if (!dwdh) return { gw: size.w, gh: size.h }
    const { dw, dh } = dwdh
    const { gw, gh } = { gw: Math.floor(size.w - dw), gh: Math.floor(size.h - dh) }
    return { gw, gh }
}