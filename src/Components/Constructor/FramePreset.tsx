import { useUtils } from "../../hooks/useUtils";
import { IFrame } from "./FramesSet";

const _ID = () => useUtils.stringID()

interface IViewServiceActions {
    RowFactory: (col: number) => { id: string, row_id: string }[]
    FrameFactory: (rows: { col: number, row_id: string }) => { view: [] }[]

}

export const FramePreset = {
    NEW: {
        id: _ID(),
        title: 'new frame',
        frames: [{
            "id": _ID(),
            "rows": [
                {
                    "row_id": _ID(),
                    "col": 1
                }
            ],
            "frCode": "1"
        },]
    },
    THREE_ONE: {
        "id": _ID(),
        "title": "31",
        "frames": [
            {
                "id": _ID(),
                "rows": [
                    {
                        "row_id": _ID(),
                        "col": 1
                    },
                    {
                        "row_id": _ID(),
                        "col": 3
                    }
                ],
                "frCode": "13"
            },
            {
                "id": _ID(),
                "rows": [
                    {
                        "row_id": _ID(),
                        "col": 1
                    },

                ],
                "frCode": "1"
            },
        ],
        "isActive": false,
    },
    ONE_ONE: {
        "isActive": false,
        "id": "11",
        "title": "1-1",
        "frames": [
            {
                "id": "1",
                "rows": [
                    {
                        "row_id": "22606a",
                        "col": 1
                    }
                ],
                "frCode": "1"
            },
            {
                "id": "2",
                "rows": [
                    {
                        "row_id": "2206a",
                        "col": 1
                    }
                ],
                "frCode": "1"
            }
        ]
    },
    ONE: {
        "isActive": false,
        "id": _ID(),
        "title": "SINGLE",
        "frames": [
            {
                "id": _ID(),
                "rows": [
                    {
                        "row_id": _ID(),
                        "col": 1
                    }
                ],
                "frCode": "1"
            }
        ]
    },
    TWO: {
        "isActive": false,
        "id": "6",
        "frames": [
            {
                "id": "7",
                "rows": [
                    {
                        "row_id": "2016a",
                        "col": 2
                    }
                ],
                "frCode": "2"
            }
        ]
    },
    THREE: {
        "isActive": false,
        "id": "8",
        "title": "THREE",
        "frames": [
            {
                "id": "9",
                "rows": [
                    {
                        "row_id": "5a112d5",
                        "col": 3
                    }
                ],
                "frCode": "3"
            }
        ]
    },
};

interface IViewModel {
    hstack: [IVFrameStack]
}

interface IVFrameStack {
    frames: [IFrame]
}