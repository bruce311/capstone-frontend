
var symbolic_flag = false //feature toggle
let current_data = null //session data

function edge_helper(sample_data, flag) {
    let sfg_elements = JSON.parse(JSON.stringify(sample_data.sfg.elements))
    let edge_length = sample_data.sfg.elements.edges.length
    let sfg_edges = []
    if (flag) {
        for (i = 0; i < edge_length; i++) {
            let new_edge = JSON.parse(JSON.stringify(sample_data.sfg.elements.edges[i]))
            // let w = new_edge.data.gain.symbolic
            // new_edge.data.weight = `\(${w}\)`
            new_edge.data.weight = new_edge.data.gain.symbolic
            sfg_edges.push(new_edge)
        }
    } else {
        for (i = 0; i < edge_length; i++) {
            let new_edge = JSON.parse(JSON.stringify(sample_data.sfg.elements.edges[i]))
            new_edge.data.weight = new_edge.data.gain.magnitude.toFixed(2)
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


// input: data.parameters
function make_parameter_panel(parameters) {
    // remove the previous form
    var old_pf = document.getElementById("input-form")
    if (old_pf != null) {
        old_pf.remove()
    }

    var pf = document.createElement("form");
    pf.id = "input-form"

    var br = document.createElement("br");

    for (let key in parameters) {
        var parameter = document.createElement("input")
        parameter.type = "number"
        parameter.name = key
        parameter.id = key
        parameter.placeholder = key + ": " + parameters[key]
        parameter.step = 0.000001
        
        pf.appendChild(parameter)
        pf.appendChild(br.cloneNode())
    }

    var s = document.createElement("input")
    s.setAttribute("type", "submit")
    s.setAttribute("value", "Submit Form")
    pf.appendChild(s)

    //add event listener
    pf.addEventListener("submit", async function (event) {
        event.preventDefault()
        console.log(event)

        let form_data = {}
        //making input
        for (let key in parameters) {
            let i = document.querySelector(`#${key}`).value
            if (i != "") {
                form_data[key] = parseFloat(i)
            }
        }
    sfg_patch_request(form_data)

    });

    document.getElementById("param-form").appendChild(pf);
}


function sfg_patch_request(params) {
    fetch("http://127.0.0.1:5000/circuits/603b0e9da3dedc2d3f44b297", {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }, 
        mode: 'cors',
        credentials: 'same-origin',
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        update_frontend(data)
    })
    .catch(error => {
        console.log(error)
    })
}


function load_interface() {
    fetch("http://127.0.0.1:5000/circuits/603b0e9da3dedc2d3f44b297")
        .then(response => {
            return response.json()
        })
        .then(data => {
            render_frontend(data)
        })
        .catch(error => {
            console.log(error)
        })
}

//Initialize frontend DOM tree
function render_frontend(data) {
    let curr_elements = edge_helper(data, symbolic_flag)
    // load SFG panel
    make_sfg(curr_elements)
    // load parameter panel
    make_parameter_panel(data.parameters)
    // load schematic panel
    // make_schematic()

    // load bode plot
    // make_bode()

    // load transfer function - only once
    make_transfer_func_panel()
}


// Update SFG and parameter panel
function update_frontend(data) {
    let curr_elements = edge_helper(data, symbolic_flag)
    // load SFG panel
    make_sfg(curr_elements)
    // load parameter panel
    make_parameter_panel(data.parameters)
}


document.addEventListener('DOMContentLoaded', load_interface);


async function sfg_toggle() {
    symbolic_flag = !symbolic_flag
    try {
        const response = await fetch("http://127.0.0.1:5000/circuits/603b0e9da3dedc2d3f44b297")
        let data = await response.json()
        update_frontend(data)
    } catch {
        alert("error when toggle sfg")
    }
    
}

let el = document.getElementById("feature-toggle");
if (el) {
    el.addEventListener('click', sfg_toggle)
}


//transfer function display helper - load MathJax script
function load_latex() {
    var old_latex = document.getElementById("MathJax-script")
    if (old_latex != null) {
        old_latex.remove()
        console.log("remove old script")
    }

    var head = document.getElementsByTagName("head")[0];
    var latex_script = document.createElement("script");
    latex_script.type = "text/javascript";
    latex_script.id="MathJax-script";
    latex_script.async = true;
    latex_script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js";
    head.appendChild(latex_script);
}


function make_transfer_func(input_node, output_node) {
    fetch(`http://127.0.0.1:5000/circuits/603b0e9da3dedc2d3f44b297/transfer_function/${input_node}/${output_node}`)
    .then(response => response.json())
    .then(data => {
        var trans = document.getElementById("trans-funtion")
        let test = "\\(" + data.transfer_function + "\\)"
        trans.innerHTML = test
    })
    .then(
        //****** !!! stack overflow  ********/
        load_latex()
    )
}


function make_transfer_func_panel() {
    var form = document.createElement("form")
    form.id = "trans-form"

    var br = document.createElement("br");

    var in_node = document.createElement("input")
    in_node.type = "text"
    in_node.name = "input_node"
    in_node.id = "input_node"
    in_node.placeholder = "input node"

    var out_node = document.createElement("input")
    out_node.type = "text"
    out_node.name = "output_node"
    out_node.id = "output_node"
    out_node.placeholder = "output node"

    form.appendChild(in_node)
    form.appendChild(br.cloneNode())
    form.appendChild(out_node)
    form.appendChild(br.cloneNode())

    var s = document.createElement("input")
    s.setAttribute("type", "submit")
    s.setAttribute("value", "Submit Form")
    form.appendChild(s)

    form.addEventListener("submit", event => {
        event.preventDefault()
        console.log(event)

        let input = document.querySelector('#input_node').value
        let output = document.querySelector('#output_node').value
 
        if (input && output){
            make_transfer_func(input, output)
        }
        else {
            alert("input field incomplete")
        }
    });

    document.getElementById("transfer-form").appendChild(form);
}






function get_schematics() {
    fetch("http://127.0.0.1:5000/circuits/603b0e9da3dedc2d3f44b297/schematic")
}