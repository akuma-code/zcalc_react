import { InitedDataNode } from "../Components/ConstructorDataModel/Store/Reducers/DM_ModelReducer"
import { IResizeDataModel } from "../Types/DataModelTypes"

export const mockNode_1: InitedDataNode = {
    "id": "mn1",
    "coords": [
        0,
        0,
        75,
        150
    ],
    "size": {
        "w": 75,
        "h": 150
    },
    "borders": [
        {
            "id": "d68b",
            "side": "left",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                10,
                150
            ]
        },
        {
            "id": "4bb5",
            "side": "top",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                150,
                10
            ]
        },
        {
            "id": "9527",
            "side": "right",
            "desc": "импост",
            "state": "imp",
            "coords": [
                140,
                0,
                150,
                150
            ]
        },
        {
            "id": "3043",
            "side": "bottom",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                140,
                150,
                150
            ]
        }
    ],
    "mergePoints": {
        "top": [
            0,
            0,
            150,
            0
        ],
        "right": [
            150,
            0,
            150,
            150
        ],
        "left": [
            0,
            0,
            0,
            150
        ],
        "bottom": [
            0,
            150,
            150,
            150
        ]
    }
} as unknown as InitedDataNode

export const mockNode_2: InitedDataNode = {
    "id": "mn2",
    "coords": [
        75,
        0,
        150,
        150
    ],
    "size": {
        "w": 75,
        "h": 150
    },
    "borders": [
        {
            "id": "d230",
            "side": "left",
            "desc": "импост",
            "state": "imp",
            "coords": [
                0,
                0,
                10,
                150
            ]
        },
        {
            "id": "96e0",
            "side": "top",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                150,
                10
            ]
        },
        {
            "id": "73f0",
            "side": "right",
            "desc": "рама",
            "state": "rama",
            "coords": [
                140,
                0,
                150,
                150
            ]
        },
        {
            "id": "2156",
            "side": "bottom",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                140,
                150,
                150
            ]
        }
    ],
    "mergePoints": {
        "top": [
            0,
            0,
            150,
            0
        ],
        "right": [
            150,
            0,
            150,
            150
        ],
        "left": [
            0,
            0,
            0,
            150
        ],
        "bottom": [
            0,
            150,
            150,
            150
        ]
    }
} as unknown as InitedDataNode

export const mockNode_3 = {
    "id": "mn3",
    "coords": [
        0,
        0,
        200,
        50
    ],
    "size": {
        "h": 50,
        "w": 200
    },
    "borders": [
        {
            "id": "f4e1",
            "side": "left",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                10,
                100
            ]
        },
        {
            "id": "97f3",
            "side": "top",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                200,
                10
            ]
        },
        {
            "id": "a8ee",
            "side": "right",
            "desc": "рама",
            "state": "rama",
            "coords": [
                190,
                0,
                200,
                100
            ]
        },
        {
            "id": "90a8",
            "side": "bottom",
            "desc": "импост",
            "state": "imp",
            "coords": [
                0,
                90,
                200,
                100
            ]
        }
    ],
    "mergePoints": {
        "top": [
            0,
            0,
            200,
            0
        ],
        "right": [
            200,
            0,
            200,
            100
        ],
        "left": [
            0,
            0,
            0,
            100
        ],
        "bottom": [
            0,
            100,
            200,
            100
        ]
    }
} as unknown as InitedDataNode

export const mockNode_4 = {
    "id": "mn4",
    "coords": [
        0,
        50,
        200,
        100
    ],
    "size": {
        "h": 50,
        "w": 200
    },
    "borders": [
        {
            "id": "fe6b",
            "side": "left",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                10,
                100
            ]
        },
        {
            "id": "a72c",
            "side": "top",
            "desc": "импост",
            "state": "imp",
            "coords": [
                0,
                0,
                200,
                10
            ]
        },
        {
            "id": "46e8",
            "side": "right",
            "desc": "рама",
            "state": "rama",
            "coords": [
                190,
                0,
                200,
                100
            ]
        },
        {
            "id": "2b33",
            "side": "bottom",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                90,
                200,
                100
            ]
        }
    ],
    "mergePoints": {
        "top": [
            0,
            0,
            200,
            0
        ],
        "right": [
            200,
            0,
            200,
            100
        ],
        "left": [
            0,
            0,
            0,
            100
        ],
        "bottom": [
            0,
            100,
            200,
            100
        ]
    }
} as unknown as InitedDataNode


export const mockModel_1: IResizeDataModel = {
    "id": "mm1",
    "nodes": [
        {
            "id": "10a9",
            "coords": [
                0,
                0,
                75,
                150
            ],
            "size": {
                "w": 75,
                "h": 150
            },
            "borders": [
                {
                    "id": "d68b",
                    "side": "left",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        0,
                        10,
                        150
                    ]
                },
                {
                    "id": "4bb5",
                    "side": "top",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        0,
                        150,
                        10
                    ]
                },
                {
                    "id": "9527",
                    "side": "right",
                    "desc": "импост",
                    "state": "imp",
                    "coords": [
                        140,
                        0,
                        150,
                        150
                    ]
                },
                {
                    "id": "3043",
                    "side": "bottom",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        140,
                        150,
                        150
                    ]
                }
            ],
            "mergePoints": {
                "top": [
                    0,
                    0,
                    150,
                    0
                ],
                "right": [
                    150,
                    0,
                    150,
                    150
                ],
                "left": [
                    0,
                    0,
                    0,
                    150
                ],
                "bottom": [
                    0,
                    150,
                    150,
                    150
                ]
            }
        },
        {
            "id": "5309",
            "coords": [
                75,
                0,
                150,
                150
            ],
            "size": {
                "w": 75,
                "h": 150
            },
            "borders": [
                {
                    "id": "d230",
                    "side": "left",
                    "desc": "импост",
                    "state": "imp",
                    "coords": [
                        0,
                        0,
                        10,
                        150
                    ]
                },
                {
                    "id": "96e0",
                    "side": "top",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        0,
                        150,
                        10
                    ]
                },
                {
                    "id": "73f0",
                    "side": "right",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        140,
                        0,
                        150,
                        150
                    ]
                },
                {
                    "id": "2156",
                    "side": "bottom",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        140,
                        150,
                        150
                    ]
                }
            ],
            "mergePoints": {
                "top": [
                    0,
                    0,
                    150,
                    0
                ],
                "right": [
                    150,
                    0,
                    150,
                    150
                ],
                "left": [
                    0,
                    0,
                    0,
                    150
                ],
                "bottom": [
                    0,
                    150,
                    150,
                    150
                ]
            }
        }
    ],
    "baseNode": {
        "id": "a779",
        "coords": [
            0,
            0,
            150,
            150
        ],
        "size": {
            "w": 150,
            "h": 150
        },
        "borders": [
            {
                "id": "0e48",
                "side": "left",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    0,
                    10,
                    150
                ]
            },
            {
                "id": "a98d",
                "side": "top",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    0,
                    150,
                    10
                ]
            },
            {
                "id": "66ad",
                "side": "right",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    140,
                    0,
                    150,
                    150
                ]
            },
            {
                "id": "2954",
                "side": "bottom",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    140,
                    150,
                    150
                ]
            }
        ],
        "mergePoints": {
            "top": [
                0,
                0,
                150,
                0
            ],
            "right": [
                150,
                0,
                150,
                150
            ],
            "left": [
                0,
                0,
                0,
                150
            ],
            "bottom": [
                0,
                150,
                150,
                150
            ]
        }
    }
} as unknown as IResizeDataModel

export const mockModel_2 = {
    "id": "mm2",
    "nodes": [
        {
            "id": "1ab4",
            "coords": [
                0,
                0,
                200,
                50
            ],
            "size": {
                "h": 50,
                "w": 200
            },
            "borders": [
                {
                    "id": "f4e1",
                    "side": "left",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        0,
                        10,
                        100
                    ]
                },
                {
                    "id": "97f3",
                    "side": "top",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        0,
                        200,
                        10
                    ]
                },
                {
                    "id": "a8ee",
                    "side": "right",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        190,
                        0,
                        200,
                        100
                    ]
                },
                {
                    "id": "90a8",
                    "side": "bottom",
                    "desc": "импост",
                    "state": "imp",
                    "coords": [
                        0,
                        90,
                        200,
                        100
                    ]
                }
            ],
            "mergePoints": {
                "top": [
                    0,
                    0,
                    200,
                    0
                ],
                "right": [
                    200,
                    0,
                    200,
                    100
                ],
                "left": [
                    0,
                    0,
                    0,
                    100
                ],
                "bottom": [
                    0,
                    100,
                    200,
                    100
                ]
            }
        },
        {
            "id": "1d8c",
            "coords": [
                0,
                50,
                200,
                100
            ],
            "size": {
                "h": 50,
                "w": 200
            },
            "borders": [
                {
                    "id": "fe6b",
                    "side": "left",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        0,
                        10,
                        100
                    ]
                },
                {
                    "id": "a72c",
                    "side": "top",
                    "desc": "импост",
                    "state": "imp",
                    "coords": [
                        0,
                        0,
                        200,
                        10
                    ]
                },
                {
                    "id": "46e8",
                    "side": "right",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        190,
                        0,
                        200,
                        100
                    ]
                },
                {
                    "id": "2b33",
                    "side": "bottom",
                    "desc": "рама",
                    "state": "rama",
                    "coords": [
                        0,
                        90,
                        200,
                        100
                    ]
                }
            ],
            "mergePoints": {
                "top": [
                    0,
                    0,
                    200,
                    0
                ],
                "right": [
                    200,
                    0,
                    200,
                    100
                ],
                "left": [
                    0,
                    0,
                    0,
                    100
                ],
                "bottom": [
                    0,
                    100,
                    200,
                    100
                ]
            }
        }
    ],
    "baseNode": {
        "id": "618a",
        "coords": [
            0,
            0,
            200,
            100
        ],
        "size": {
            "w": 200,
            "h": 100
        },
        "borders": [
            {
                "id": "cfe2",
                "side": "left",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    0,
                    10,
                    100
                ]
            },
            {
                "id": "217b",
                "side": "top",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    0,
                    200,
                    10
                ]
            },
            {
                "id": "4498",
                "side": "right",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    190,
                    0,
                    200,
                    100
                ]
            },
            {
                "id": "1162",
                "side": "bottom",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    90,
                    200,
                    100
                ]
            }
        ],
        "mergePoints": {
            "top": [
                0,
                0,
                200,
                0
            ],
            "right": [
                200,
                0,
                200,
                100
            ],
            "left": [
                0,
                0,
                0,
                100
            ],
            "bottom": [
                0,
                100,
                200,
                100
            ]
        }
    }
} as unknown as IResizeDataModel

export const mockNode_3_1 = {
    "id": "mn3-1",
    "coords": [
        0,
        0,
        50,
        100
    ],
    "size": {
        "w": 50,
        "h": 100
    },
    "borders": [
        {
            "id": "f686",
            "side": "left",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                10,
                100
            ]
        },
        {
            "id": "8eab",
            "side": "top",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                200,
                10
            ]
        },
        {
            "id": "c38e",
            "side": "right",
            "desc": "импост",
            "state": "imp",
            "coords": [
                190,
                0,
                200,
                100
            ]
        },
        {
            "id": "fa16",
            "side": "bottom",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                90,
                200,
                100
            ]
        }
    ],
    "mergePoints": {
        "top": [
            0,
            0,
            200,
            0
        ],
        "right": [
            200,
            0,
            200,
            100
        ],
        "left": [
            0,
            0,
            0,
            100
        ],
        "bottom": [
            0,
            100,
            200,
            100
        ]
    }
} as unknown as InitedDataNode

export const mockNode_3_2 = {
    "id": "mn3-2",
    "coords": [
        50,
        0,
        100,
        100
    ],
    "size": {
        "w": 50,
        "h": 100
    },
    "borders": [
        {
            "id": "5316",
            "side": "left",
            "desc": "импост",
            "state": "imp",
            "coords": [
                0,
                0,
                10,
                100
            ]
        },
        {
            "id": "00ea",
            "side": "top",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                200,
                10
            ]
        },
        {
            "id": "785c",
            "side": "right",
            "desc": "импост",
            "state": "imp",
            "coords": [
                190,
                0,
                200,
                100
            ]
        },
        {
            "id": "6099",
            "side": "bottom",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                90,
                200,
                100
            ]
        }
    ],
    "mergePoints": {
        "top": [
            0,
            0,
            200,
            0
        ],
        "right": [
            200,
            0,
            200,
            100
        ],
        "left": [
            0,
            0,
            0,
            100
        ],
        "bottom": [
            0,
            100,
            200,
            100
        ]
    }
} as unknown as InitedDataNode




const mn1 = {
    "id": "1",
    "coords": [
        0,
        0,
        100,
        250
    ],
    "size": {
        "w": 100,
        "h": 250
    },
    "borders": [
        {
            "id": "f686",
            "side": "left",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                10,
                250
            ]
        },
        {
            "id": "8eab",
            "side": "top",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                0,
                100,
                10
            ]
        },
        {
            "id": "c38e",
            "side": "right",
            "desc": "импост",
            "state": "imp",
            "coords": [
                94,
                0,
                100,
                250
            ]
        },
        {
            "id": "fa16",
            "side": "bottom",
            "desc": "рама",
            "state": "rama",
            "coords": [
                0,
                240,
                100,
                250
            ]
        }
    ],
    "mergePoints": {
        "top": [
            0,
            0,
            100,
            0
        ],
        "right": [
            100,
            0,
            100,
            250
        ],
        "left": [
            0,
            0,
            0,
            250
        ],
        "bottom": [
            0,
            250,
            100,
            250
        ]
    }
}
const mn2 = {
    "id": "2",
    "coords": [
        100,
        0,
        200,
        250
    ],
    "size": {
        "w": 100,
        "h": 250
    },
    "borders": [
        {
            "id": "5316",
            "side": "left",
            "desc": "импост",
            "state": "imp",
            "coords": [
                100,
                0,
                106,
                250
            ]
        },
        {
            "id": "00ea",
            "side": "top",
            "desc": "рама",
            "state": "rama",
            "coords": [
                100,
                0,
                200,
                10
            ]
        },
        {
            "id": "785c",
            "side": "right",
            "desc": "импост",
            "state": "imp",
            "coords": [
                194,
                0,
                200,
                250
            ]
        },
        {
            "id": "6099",
            "side": "bottom",
            "desc": "рама",
            "state": "rama",
            "coords": [
                100,
                240,
                200,
                250
            ]
        }
    ],
    "mergePoints": {
        "top": [
            100,
            0,
            200,
            0
        ],
        "right": [
            200,
            0,
            200,
            250
        ],
        "left": [
            100,
            0,
            100,
            250
        ],
        "bottom": [
            100,
            250,
            200,
            250
        ]
    }
}
const mn3 = {
    "id": "3",
    "coords": [
        200,
        0,
        400,
        250
    ],
    "size": {
        "w": 200,
        "h": 250
    },
    "borders": [
        {
            "id": "297f",
            "side": "left",
            "desc": "импост",
            "state": "imp",
            "coords": [
                200,
                0,
                206,
                250
            ]
        },
        {
            "id": "d4fb",
            "side": "top",
            "desc": "рама",
            "state": "rama",
            "coords": [
                200,
                0,
                400,
                10
            ]
        },
        {
            "id": "e4ae",
            "side": "right",
            "desc": "рама",
            "state": "rama",
            "coords": [
                390,
                0,
                400,
                250
            ]
        },
        {
            "id": "db56",
            "side": "bottom",
            "desc": "рама",
            "state": "rama",
            "coords": [
                200,
                240,
                400,
                250
            ]
        }
    ],
    "mergePoints": {
        "top": [
            200,
            0,
            400,
            0
        ],
        "right": [
            400,
            0,
            400,
            250
        ],
        "left": [
            200,
            0,
            200,
            250
        ],
        "bottom": [
            200,
            250,
            400,
            250
        ]
    }
}

export const mockNodesHor = [
    mn3,
    mn1,
    mn2,
] as unknown as InitedDataNode[]


export const mockNodes_1_4 = [
    {
        "id": "1",
        "coords": [
            0,
            0,
            75,
            190
        ],
        "size": {
            "w": 75,
            "h": 190
        },
        "borders": [
            {
                "id": "0d25",
                "side": "left",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    0,
                    10,
                    190
                ]
            },
            {
                "id": "60f4",
                "side": "top",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    0,
                    150,
                    10
                ]
            },
            {
                "id": "ca53",
                "side": "right",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    140,
                    0,
                    150,
                    190
                ]
            },
            {
                "id": "87f9",
                "side": "bottom",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    180,
                    150,
                    190
                ]
            }
        ],
        "mergePoints": {
            "top": [
                0,
                0,
                150,
                0
            ],
            "right": [
                150,
                0,
                150,
                190
            ],
            "left": [
                0,
                0,
                0,
                190
            ],
            "bottom": [
                0,
                190,
                150,
                190
            ]
        }
    },
    {
        "id": "2",
        "coords": [
            75,
            0,
            150,
            47.5
        ],
        "size": {
            "h": 47.5,
            "w": 75
        },
        "borders": [
            {
                "id": "72ce",
                "side": "left",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    0,
                    10,
                    190
                ]
            },
            {
                "id": "1aba",
                "side": "top",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    0,
                    150,
                    10
                ]
            },
            {
                "id": "df20",
                "side": "right",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    140,
                    0,
                    150,
                    190
                ]
            },
            {
                "id": "922a",
                "side": "bottom",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    180,
                    150,
                    190
                ]
            }
        ],
        "mergePoints": {
            "top": [
                0,
                0,
                150,
                0
            ],
            "right": [
                150,
                0,
                150,
                190
            ],
            "left": [
                0,
                0,
                0,
                190
            ],
            "bottom": [
                0,
                190,
                150,
                190
            ]
        }
    },
    {
        "id": "3",
        "coords": [
            75,
            47.5,
            150,
            95
        ],
        "size": {
            "h": 47.5,
            "w": 75
        },
        "borders": [
            {
                "id": "05ab",
                "side": "left",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    0,
                    10,
                    190
                ]
            },
            {
                "id": "80eb",
                "side": "top",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    0,
                    150,
                    10
                ]
            },
            {
                "id": "aca5",
                "side": "right",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    140,
                    0,
                    150,
                    190
                ]
            },
            {
                "id": "1454",
                "side": "bottom",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    180,
                    150,
                    190
                ]
            }
        ],
        "mergePoints": {
            "top": [
                0,
                0,
                150,
                0
            ],
            "right": [
                150,
                0,
                150,
                190
            ],
            "left": [
                0,
                0,
                0,
                190
            ],
            "bottom": [
                0,
                190,
                150,
                190
            ]
        }
    },
    {
        "id": "4",
        "coords": [
            75,
            95,
            150,
            142.5
        ],
        "size": {
            "h": 47.5,
            "w": 75
        },
        "borders": [
            {
                "id": "a682",
                "side": "left",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    0,
                    10,
                    190
                ]
            },
            {
                "id": "72fe",
                "side": "top",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    0,
                    150,
                    10
                ]
            },
            {
                "id": "f8c0",
                "side": "right",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    140,
                    0,
                    150,
                    190
                ]
            },
            {
                "id": "22d8",
                "side": "bottom",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    180,
                    150,
                    190
                ]
            }
        ],
        "mergePoints": {
            "top": [
                0,
                0,
                150,
                0
            ],
            "right": [
                150,
                0,
                150,
                190
            ],
            "left": [
                0,
                0,
                0,
                190
            ],
            "bottom": [
                0,
                190,
                150,
                190
            ]
        }
    },
    {
        "id": "5",
        "coords": [
            75,
            142.5,
            150,
            190
        ],
        "size": {
            "h": 47.5,
            "w": 75
        },
        "borders": [
            {
                "id": "75dc",
                "side": "left",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    0,
                    10,
                    190
                ]
            },
            {
                "id": "35c6",
                "side": "top",
                "desc": "импост",
                "state": "imp",
                "coords": [
                    0,
                    0,
                    150,
                    10
                ]
            },
            {
                "id": "3085",
                "side": "right",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    140,
                    0,
                    150,
                    190
                ]
            },
            {
                "id": "61e6",
                "side": "bottom",
                "desc": "рама",
                "state": "rama",
                "coords": [
                    0,
                    180,
                    150,
                    190
                ]
            }
        ],
        "mergePoints": {
            "top": [
                0,
                0,
                150,
                0
            ],
            "right": [
                150,
                0,
                150,
                190
            ],
            "left": [
                0,
                0,
                0,
                190
            ],
            "bottom": [
                0,
                190,
                150,
                190
            ]
        }
    }
]