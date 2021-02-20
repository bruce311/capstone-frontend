export default 
{
    "_id": "60282be724b84836cf10ead3",
    "name": "2n3904_common_emitter",
    "parameters": {
        "C_D": 1e-05,
        "R_D": 20000.0,
        "R_S": 4,
        "g_m": 2,
        "r_o": 3,
        "w": 100000.0
    },
    "sfg": {
        "data": [],
        "directed": true,
        "elements": {
            "edges": [
                {
                    "data": {
                        "gain": {
                            "magnitude": 1.0,
                            "phase": 0.0,
                            "symbolic": "1"
                        },
                        "source": "v_i",
                        "target": "v_gs"
                    }
                },
                {
                    "data": {
                        "gain": {
                            "magnitude": 2.0,
                            "phase": 0.0,
                            "symbolic": "g_{m}"
                        },
                        "source": "v_gs",
                        "target": "v_x"
                    }
                },
                {
                    "data": {
                        "gain": {
                            "magnitude": 2.0,
                            "phase": 3.141592653589793,
                            "symbolic": "- g_{m}"
                        },
                        "source": "v_gs",
                        "target": "I_sco"
                    }
                },
                {
                    "data": {
                        "gain": {
                            "magnitude": 1.7142857142857142,
                            "phase": 0.0,
                            "symbolic": "\\frac{1}{\\frac{1}{r_{o}} + \\frac{1}{R_{S}}}"
                        },
                        "source": "v_x",
                        "target": "v_s"
                    }
                },
                {
                    "data": {
                        "gain": {
                            "magnitude": 0.948669067053995,
                            "phase": -1.2490007730732746,
                            "symbolic": "\\frac{1}{i C_{D} w + \\frac{1}{r_{o}} + \\frac{1}{R_{D}}}"
                        },
                        "source": "I_sco",
                        "target": "v_o"
                    }
                },
                {
                    "data": {
                        "gain": {
                            "magnitude": 1.0,
                            "phase": 3.141592653589793,
                            "symbolic": "-1"
                        },
                        "source": "v_s",
                        "target": "v_gs"
                    }
                },
                {
                    "data": {
                        "gain": {
                            "magnitude": 0.3333333333333333,
                            "phase": 0.0,
                            "symbolic": "\\frac{1}{r_{o}}"
                        },
                        "source": "v_s",
                        "target": "I_sco"
                    }
                },
                {
                    "data": {
                        "gain": {
                            "magnitude": 0.3333333333333333,
                            "phase": 0.0,
                            "symbolic": "\\frac{1}{r_{o}}"
                        },
                        "source": "v_o",
                        "target": "v_x"
                    }
                }
            ],
            "nodes": [
                {
                    "data": {
                        "id": "v_i",
                        "name": "v_i",
                        "value": "v_i"
                    }
                },
                {
                    "data": {
                        "id": "v_gs",
                        "name": "v_gs",
                        "value": "v_gs"
                    }
                },
                {
                    "data": {
                        "id": "v_x",
                        "name": "v_x",
                        "value": "v_x"
                    }
                },
                {
                    "data": {
                        "id": "I_sco",
                        "name": "I_sco",
                        "value": "I_sco"
                    }
                },
                {
                    "data": {
                        "id": "v_s",
                        "name": "v_s",
                        "value": "v_s"
                    }
                },
                {
                    "data": {
                        "id": "v_o",
                        "name": "v_o",
                        "value": "v_o"
                    }
                }
            ]
        },
        "multigraph": false
    }
}