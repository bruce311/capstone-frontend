
var symbolic_flag = false //feature toggle
let current_data = null //session data

function edge_helper(sample_data, flag) {
    let sfg_elements = JSON.parse(JSON.stringify(sample_data.sfg.elements))
    let edge_length = sample_data.sfg.elements.edges.length
    let sfg_edges = []
    if (flag) {
        for (i = 0; i < edge_length; i++) {
            let new_edge = JSON.parse(JSON.stringify(sample_data.sfg.elements.edges[i]))
            new_edge.data.weight = new_edge.data.gain.symbolic
            sfg_edges.push(new_edge)
        }
    } else {
        for (i = 0; i < edge_length; i++) {
            let new_edge = JSON.parse(JSON.stringify(sample_data.sfg.elements.edges[i]))
            new_edge.data.weight = new_edge.data.gain.magnitude

            sfg_edges.push(new_edge)
        }
    }
    sfg_elements.edges = JSON.parse(JSON.stringify(sfg_edges))
    return sfg_elements
}

function make_sfg(elements) {
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

        elements: elements
    });
}


function load_sfg() {
    fetch("http://127.0.0.1:5000/circuits/603b0e9da3dedc2d3f44b297")
        .then(response => {
            return response.json()
        })
        .then(data => {
            let curr_elements =   edge_helper(data, symbolic_flag)
            make_sfg(curr_elements)
        })
}

document.addEventListener('DOMContentLoaded', load_sfg);


function sfg_toggle() {
    symbolic_flag = !symbolic_flag
    load_sfg()
}

let el = document.getElementById("feature-toggle");
if (el) {
    el.addEventListener('click', sfg_toggle)
}

