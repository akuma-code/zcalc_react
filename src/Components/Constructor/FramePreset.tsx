import { useUtils } from "../../hooks/useUtils";
import { IFrame } from "./FramesSet";

const _ID = () => useUtils.stringID()

interface IViewServiceActions {
    RowFactory: (cols: number) => { id: string, row_id: string }[]
    FrameFactory: (rows: { cols: number, row_id: string }) => { view: [] }[]

}

export const FramePreset = {
    NEW: {
        id: () => _ID(),
        title: 'new frame',
        view: [{
            "id": _ID(),
            "rows": [
                {
                    "row_id": _ID(),
                    "cols": 1
                }
            ],
            "frCode": "1"
        },]
    },
    THREE_ONE: {
        "id": _ID(),
        "title": "31",
        "view": [
            {
                "id": _ID(),
                "rows": [
                    {
                        "row_id": _ID(),
                        "cols": 1
                    },
                    {
                        "row_id": _ID(),
                        "cols": 3
                    }
                ],
                "frCode": "13"
            },
            {
                "id": _ID(),
                "rows": [
                    {
                        "row_id": _ID(),
                        "cols": 1
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
        "view": [
            {
                "id": "1",
                "rows": [
                    {
                        "row_id": "22606a",
                        "cols": 1
                    }
                ],
                "frCode": "1"
            },
            {
                "id": "2",
                "rows": [
                    {
                        "row_id": "2206a",
                        "cols": 1
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
        "view": [
            {
                "id": _ID(),
                "rows": [
                    {
                        "row_id": _ID(),
                        "cols": 1
                    }
                ],
                "frCode": "1"
            }
        ]
    },
    TWO: {
        "isActive": false,
        "id": "6",
        "view": [
            {
                "id": "7",
                "rows": [
                    {
                        "row_id": "2016a",
                        "cols": 2
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
        "view": [
            {
                "id": "9",
                "rows": [
                    {
                        "row_id": "5a112d5",
                        "cols": 3
                    }
                ],
                "frCode": "3"
            }
        ]
    },
};
