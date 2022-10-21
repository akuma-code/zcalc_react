import { useUtils } from '../hooks/useUtils'

export const FRAME = (w: number, h: number, left?: number, right?: number) => {
    const F = {
        frames: [
            {
                id: 1,
                bot: "rama",
                left: "rama",
                top: 'rama',
                right: "rama",
                posNumb: 1,
                state: "fix",
                frameSize: { w: w, h: h }
            }
        ],
        size: {
            H: h,
            W: w,
        }
    }


    const FF = {
        frames: [
            {
                id: 1,
                title: "left",
                bot: "rama",
                left: "rama",
                top: 'rama',
                right: "rama",
                posNumb: 1,
                state: "fix",
                frameSize: {
                    h: h,
                    w: left || w / 2,
                }
            },
            {
                id: 2,
                title: "right",
                bot: "rama",
                left: "rama",
                top: 'rama',
                right: "rama",
                posNumb: 2,
                state: "fix",
                frameSize: {
                    h: h,
                    w: left ? w - left : w / 2,
                }
            },
        ],
        size:
        {
            H: h,
            W: w,
        }
    }

    return { F, FF } as const

}



export const fixframeF = {
    id: '1',
    bot: "rama",
    left: "rama",
    top: 'rama',
    right: "rama",
    posNumb: 1,
    state: "fix",
    row: 1
} as const
export const stvframeF = {
    id: '2',
    bot: "stv_rama",
    left: "shtulp_imp",
    top: 'stv_rama',
    right: "stv_rama",
    posNumb: 1,
    state: "stv",
} as const
export const shtulpframeF = {
    id: '3',
    bot: "stv_rama",
    left: "shtulp_imp",
    top: 'stv_rama',
    right: "stv_rama",
    posNumb: 1,
    state: "shtulp",
} as const



const initFrames = [
    { row: 1, posNumb: 1 },
    { row: 1, posNumb: 2 },
    { row: 1, posNumb: 3 },
    { row: 2, posNumb: 4 },
    { row: 2, posNumb: 5 },
]
const initWFFrames = [
    {
        row_id: 1,
        isActive: true,
        wf_parts: [{ part_id: 10 }, { part_id: 20 }]
    },

    {
        row_id: 2,
        isActive: true,
        wf_parts: [{ part_id: 16 }, { part_id: 12 }]
    },
]


const initROW = {
    id: 1,
    isActive: false,
    wf_parts: [{
        part_id: genID(),
        row_id: 1
    }]
}
const initFrame = {
    id: genID(),
    wf_rows: [
        {
            id: 1,
            isActive: false,
            wf_parts: [{
                part_id: genID(),
                row_id: 1
            }]
        },

    ]
}

const test = {
    id: 1,
    wf_rows: [
        {
            id: 1,
            isActive: false,
            wf_parts: [{
                part_id: genID(),
                row_id: 1
            }]
        },
        {
            id: 2,
            isActive: false,
            wf_parts: [{
                part_id: genID(),
                row_id: 2
            },
            {
                part_id: genID(),
                row_id: 2
            }]
        }
    ]
}

function genID() {
    throw new Error('Function not implemented.')
}
