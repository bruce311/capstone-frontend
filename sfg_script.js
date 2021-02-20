var sfg_data =
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
                        "weight": {
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
                        "weight": {
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
                        "weight": {
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
                        "weight": {
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
                        "weight": {
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
                        "weight": {
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
                        "weight": {
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
                        "weight": {
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
};

// console.log(sfg_data.sfg.elements.nodes);

// symbolic vs magnitude feature toggle
var symbolic_flag = false


var sfg_elements = sfg_data.sfg.elements;
var edge_length = sfg_data.sfg.elements.edges.length;
var sfg_edges = []


function edge_helper() {
    if (symbolic_flag) {
        for (i = 0; i < edge_length; i++) {
            var new_edge = sfg_data.sfg.elements.edges[i]
            new_edge.data.weight = new_edge.data.weight.symbolic
            sfg_edges.push(new_edge)
        }
    } else {
        for (i = 0; i < edge_length; i++) {
            var new_edge = sfg_data.sfg.elements.edges[i]
            new_edge.data.weight = new_edge.data.weight.magnitude
            sfg_edges.push(new_edge)
        }
    }
    sfg_elements.edges = sfg_edges
}

// generate the edited edge list
edge_helper()

function load_sfg() {

    var con = document.getElementById('cy')
    console.log(con)

    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),

        layout: {
        name: 'grid',
        rows: 2,
        cols: 2
        },

        style: [
        {
            selector: 'node[name]',
            style: {
            'content': 'data(name)'
            }
        },

        {
            selector: 'edge',
            style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'content': 'data(weight)'
            }
        },

        {
            selector: '.eh-handle',
            style: {
            'background-color': 'red',
            'width': 12,
            'height': 12,
            'shape': 'ellipse',
            'overlay-opacity': 0,
            'border-width': 12, // makes the handle easier to hit
            'border-opacity': 0
            }
        },

        {
            selector: '.eh-hover',
            style: {
            'background-color': 'red'
            }
        },

        {
            selector: '.eh-source',
            style: {
            'border-width': 2,
            'border-color': 'red'
            }
        },

        {
            selector: '.eh-target',
            style: {
            'border-width': 2,
            'border-color': 'red'
            }
        },

        {
            selector: '.eh-preview, .eh-ghost-edge',
            style: {
            'background-color': 'red',
            'line-color': 'red',
            'target-arrow-color': 'red',
            'source-arrow-color': 'red'
            }
        },

        {
            selector: '.eh-ghost-edge.eh-preview-active',
            style: {
            'opacity': 0
            }
        }
        ],
        elements: sfg_elements
    });
}


document.addEventListener('DOMContentLoaded', load_sfg);


function sfg_toggle() {
    console.log("event toggle triggered")
    symbolic_flag = !symbolic_flag
    edge_helper()
    load_sfg()
}

console.log("after loading sfg graph")
console.log(document)

// feature toggles
var ab = document.querySelector("#feature-toggle");
console.log(ab)
var el = document.getElementById("sfg-extra");
console.log(el)


var cd = document.getElementById('cy');
console.log(cd)


if (el) {
    el.addEventListener('click', sfg_toggle)
    console.log(symbolic_flag)
}








// elements: {
// nodes: [
//     { data: { id: 'Nvb', name: 'Vb', value: '' } },
//     { data: { id: 'Nve', name: 'Ve', value: '' } },
//     { data: { id: 'Nvc', name: 'Vc', value: '' } },
//     { data: { id: 'Nvin', name: 'Vin', value: '' } },
//     { data: { id: 'Nn001', name: 'Vn001', value: '' } },
//     { data: { id: 'Nvout', name: 'Vout', value: '' } },
//     { data: { id: 'Iscvb', name: 'Iscvb', value: '' } },
//     { data: { id: 'Iscve', name: 'Iscve', value: '' } },
//     { data: { id: 'Iscvc', name: 'Iscvc', value: '' } },
//     { data: { id: 'Iscvin', name: 'Iscvin', value: '' } },
//     { data: { id: 'Iscn001', name: 'Iscn001', value: '' } },
//     { data: { id: 'Iscvout', name: 'Iscvout', value: '' } }
// ],
// edges: [
//     { data: { source: 'Iscvb', target: 'Nvb', weight: 'Rpi//R2//R1//1/sC1'} },
//     { data: { source: 'Nve', target: 'Iscvb', weight: '1/Rpi'} },
//     { data: { source: 'Nvin', target: 'Iscvb', weight: '1/C1'} },
//     { data: { source: 'Iscve', target: 'Nve', weight: 'Rpi//Ro//Re//1/sC2'} },
//     { data: { source: 'Nvb', target: 'Iscve', weight: '1/Rpi + gm'} },
//     { data: { source: 'Nve', target: 'Iscve', weight: '-gm'} },
//     { data: { source: 'Nvc', target: 'Iscve', weight: '1/Ro'} },
//     { data: { source: 'Nn001', target: 'Iscve', weight: 'sC2'} },
//     { data: { source: 'Iscvc', target: 'Nvc', weight: 'Ro//1/sC3//Rc'} },
//     { data: { source: 'Nvb', target: 'Iscvc', weight: '-gm'} },
//     { data: { source: 'Nve', target: 'Iscvc', weight: '1/Ro'} },
//     { data: { source: 'Nvout', target: 'Iscvc', weight: 'sC3'} },
//     { data: { source: 'Iscvin', target: 'Nvin', weight: 'C1'} },
//     { data: { source: 'Nvb', target: 'Iscvin', weight: '1/C1'} },
//     { data: { source: 'Iscn001', target: 'Nn001', weight: '1/sC2//R5'} },
//     { data: { source: 'Nve', target: 'Iscn001', weight: '1/sC2'} },
//     { data: { source: 'Iscvout', target: 'Nvout', weight: '1/sC3'} },
//     { data: { source: 'Nvc', target: 'Iscvout', weight: 'sC3'} }
// ]
// }