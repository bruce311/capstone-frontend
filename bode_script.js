window.addEventListener('load', _ready, false)

let input_textbox
let input_button
let xs

/**
 * Generate logspace.
 * @param {Float} min Starting number
 * @param {Float} max Ending number
 * @param {Float} step Step (multiplied by)
 */
function logspace(min, max, step){
    var v = []
    for(var i = min; i <= max; i *= step){
        v.push(i);
    }
    return v;
}

function _ready(){
    xs = logspace(1e-2, 1e6, 10)

    input_textbox = document.getElementById("transfer-function")
    input_textbox.addEventListener("change", update_tf, false)
}

let tf = math.parse('s')
let compiled

function update_tf(){
    tf = math.parse(input_textbox.value)
    compiled = tf.compile()
    try {
        compiled.eval({'s': math.complex(0, 1)})
        document.getElementById("output").textContent = tf
        bode_plot()
    } catch(err){
        document.getElementById("output").textContent = err
    }
}

let modulePlot
let phasePlot

function bode_plot(){

    // --- UTILITY FUNCTIONS --- begin
    function create_data(y, label){
        return {
            labels: xs,
            datasets: [{
                label: label,
                fill: false,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: y
            }]
        }
    }

    function update_chart(chart, chart_context, y, label, scales){
        var data = create_data(y, label)
        if(chart == undefined){
            chart = new Chart(chart_context, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,        
                    scales: scales
                }
            })
        } else {
            chart.config.data = data
            chart.update();
        }
    }
    // --- UTILITY FUNCTIONS --- end

    ys = xs.map((w) => {
        return compiled.eval({s: math.complex(0, w)}).toPolar()
    })

    var y_module = ys.map(c => c.r)
    var y_phase = ys.map(c => c.phi / math.pi * 180)

    var modulePlotContext = document.getElementById("module-plot").getContext('2d')
    update_chart(modulePlot, modulePlotContext, y_module,
        label = "|T(ωj)|",
        scales = {
            yAxes: [{
                type: 'logarithmic'
            }]
        }
    )

    var phasePlotContext = document.getElementById("phase-plot").getContext('2d')
    update_chart(phasePlot, phasePlotContext, y_phase,
        label = "∠T(ωj)",
        scales = {
            yAxes: [{
                ticks: {
                    suggestedMin: -90,
                    suggestedMax: 90
                }
            }]
        }
    )
}