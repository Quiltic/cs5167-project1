// THIS IS TO LOAD ALL IMAGES INTO PAGE //
// Yoinked from https://stackoverflow.com/questions/55268506/how-do-i-fetch-all-images-in-a-folder-with-ajax-using-pure-js/
var xhr = new XMLHttpRequest();
xhr.open("GET", "/Icons", true);
xhr.responseType = 'document';
xhr.onload = () => {
    if (xhr.status === 200) {
        var elements = xhr.response.getElementsByTagName("a");
        for (x of elements) {
            if (x.href.match(/\.(jpe?g|png|gif)$/)) {
                let img = document.createElement("img");
                img.src = x.href;
                //document.body.appendChild(img);
            }
        };
    }
    else {
        alert('Request failed. Returned status of ' + xhr.status);
    }
}
xhr.send()
// THIS IS TO LOAD ALL IMAGES INTO PAGE //




var stats = {
    "selected": 0,
    "in_graph": 0,

    "water": {
        "locked": false, // to stop the bar from jittering
        "states": ["Dry", "Moist", "Damp", "Flooded"],
        "curent_state": 2, // the word value is taken from the states above
        "number": 50,
        "range": [20, 40, 70, 100],
        "backcolor": "rgba(0,0,255,1.0)",
        "linecolor": "rgba(0,0,255,0.1)",
        "data": [46, 44, 41, 37, 30, 24, 20, 13, 60, 57, 54, 96, 94, 92, 86],// 79, 74, 72, 66, 63, 57, 52, 48, 41, 38],
        "data_time": ['13:28', '13:28', '13:28', '13:28', '13:28', '13:28', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29'],// '13:29:49', '13:29:54', '13:29:59', '13:30:04', '13:30:09', '13:30:14', '13:30:19', '13:30:24', '13:30:29', '13:30:34'],
    },



    "sun": {
        "locked": false, // to stop the bar from jittering
        "states": ["Dark", "Shaded", "Bright", "Sunburnt"],
        "curent_state": 2, // the word value is taken from the states above
        "number": 50,
        "range": [30, 50, 80, 100],
        "backcolor": "rgba(255,100,0,1.0)",
        "linecolor": "rgba(255,100,0,0.1)",
        "data": [92, 89, 81, 77, 81, 84, 74, 87, 94, 74, 94, 81, 90, 73, 92],// 88, 84, 79, 93, 83, 83, 87, 91, 88, 86],
        "data_time": ['13:28', '13:28', '13:28', '13:28', '13:28', '13:28', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29'],// '13:29:49', '13:29:54', '13:29:59', '13:30:04', '13:30:09', '13:30:14', '13:30:19', '13:30:24', '13:30:29', '13:30:34'],
    },



    "temp": {
        "locked": false, // to stop the bar from jittering
        "states": ["Cold", "Good", "Hot", "Hot"],
        "curent_state": 1, // the word value is taken from the states above
        "number": 50,
        "range": [30, 45, 70, 100],
        "backcolor": "rgba(100,0,100,1.0)",
        "linecolor": "rgba(100,0,100,0.1)",
        "data": [78.8, 80.6, 81.9, 81.5, 80.1, 81.5, 80.1, 79.2, 80.1, 77.8, 81.0, 79.7, 79.7, 78.3, 78.3],// 81.0, 78.3, 79.7, 80.1, 80.6, 78.8, 78.8, 79.7, 81.0, 81.5],
        "data_time": ['13:28', '13:28', '13:28', '13:28', '13:28', '13:28', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29', '13:29'],// '13:29:49', '13:29:54', '13:29:59', '13:30:04', '13:30:09', '13:30:14', '13:30:19', '13:30:24', '13:30:29', '13:30:34'],
    },

};


// Helpers //

const types = ["water", "sun", "temp"];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function make_caps(word) {
    return (word[0].toUpperCase() + word.slice(1));
}


function find_state(id, number) {
    let id_range = stats[id]["range"];

    let item = undefined;
    id_range.every((val, indx) => {
        if (number <= val) { item = indx; return (false); }
        return (true);
    });
    //console.log(item);
    return (item);
}


function get_time() {
    let time = new Date();
    let hour = time.getHours();
    let min = time.getMinutes();
    let sec = time.getSeconds();
 
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return(hour+":"+min);//+":"+sec);
}

// End of Helpers //


// Updaters //

function image_update(id, state) {
    // replaces one of the main images based on its id (water/sun/temp) and state (0-3, or 0-2 for temp)
    let img = document.getElementById("pic_" + id);
    let val = stats[id]["states"][state].toLowerCase(); // clean 
    img.src = "/Icons/" + id + "_" + val + ".png";
    img.alt = id + " " + val;
}


function bar_update(id, percent) {
    // updates the bar's wording and progress

    // this is to stop jittering
    if (!stats[id]['locked']) {
        stats[id]['locked'] = true;

        // Update the graph data
        let val = percent;
        if (id == "temp") {
            val = (0.45 * percent + 45).toFixed(1);
        }
        stats[id]["data"].shift();
        stats[id]["data"].push(val);

        stats[id]["data_time"].shift();
        stats[id]["data_time"].push(get_time());



        // update the bar

        let bar = document.getElementById("bar_" + id);

        var function_interval = setInterval(frame, 10);
        function frame() {
            if (stats[id]["number"] == percent) {
                clearInterval(function_interval);
                let state = find_state(id, stats[id]["number"]);

                //console.log(state);
                image_update(id, state);
                stats[id]['locked'] = false;
            } else {
                //console.log(percent)
                if (stats[id]["number"] > percent) { stats[id]["number"]--; }
                else { stats[id]["number"]++; }

                bar.style.width = stats[id]["number"] + "%";

                let val = stats[id]["number"];
                if (id == "temp") {
                    val = (0.45 * stats[id]["number"] + 45).toFixed(1);
                    let C = ((val-32)*(5/9)).toFixed(1);
                    bar.innerHTML = make_caps(id) + ": " + val + "°F / " + C + "°C";

                } else {
                bar.innerHTML = make_caps(id) + ": " + val + "%";
                }
            }
        }

        // if we are in graph mode, go to the graph
        if (stats["in_graph"]) {
            go_to_graph();
        }    
    }
}

function change_selected(val) {
    // this changes what is selected both visualy and in code

    let id = types[stats["selected"]];

    let bar = document.getElementById("progress_" + id);
    bar.style.border = "4px solid whitesmoke";

    stats["selected"] = ((stats["selected"] + val) % 3); // majic
    //console.log(stats['selected']);

    id = types[stats["selected"]];
    bar = document.getElementById("progress_" + id);
    bar.style.border = "4px solid black";

    if (stats["in_graph"]) {
        go_to_graph();
    } else {
        go_to_bars();
    }

}


function go_to_graph() {
    // updates the graph and hides unused elements

    for (let item = 0; item < 3; item++) {
        let block = document.getElementById("block_" + item);
        block.hidden = true;
    }
    block = document.getElementById("block_" + stats['selected']);
    block.hidden = false;

    block = document.getElementById("chart");
    block.style.display = "";

    let id = types[stats["selected"]];

    new Chart("chart", {
        type: "line",
        data: {
            labels: stats[id]["data_time"],
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: stats[id]["backcolor"],
                borderColor: stats[id]["linecolor"],
                data: stats[id]["data"]
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                xAxes: {
                        sec: '00:00:00',
                    },
                yAxes: [{ ticks: { min: 0, max: 100 } }],
            }
        }
    });
}

function go_to_bars() {
    // hides the graph and unhides the bars

    for (let item = 0; item < 3; item++) {
        let block = document.getElementById("block_" + item);
        block.hidden = false;
    }

    block = document.getElementById("chart");
    block.style.display = "none";
}



function switch_state() {
    // change between bar and graph state

    stats["in_graph"] = Math.abs(stats["in_graph"] - 1);
    
    let img = document.getElementById("select_button");
    

    if (stats["in_graph"]) {
        go_to_graph();
        img.src = "./Icons/Arrow2.png";
    } else {
        go_to_bars();
        img.src = "./Icons/Button2.png";
    }
}


// End of Updaters //


setInterval(do_stuff_over_day, 5000); // update the bars and items every 5 seconds


// document.addEventListener('keypress', (event) => {
//     if (event.key == " ") {
//         // bar_update("water", Math.floor(Math.random() * 100));
//         // bar_update("sun", Math.floor(Math.random() * 100));
//         // bar_update("temp", Math.floor(Math.random() * 100));
//         go_to_graph();
//     }
// })


function do_stuff_over_day() {
    // the simulation

    let water = stats["water"];

    let time = new Date();
    let hour = time.getHours();
    let min = time.getMinutes();

    let num = Math.sin(((hour + (min / 60)) / 3.82) - 2.5); // this is to represent the change over the course of the day
    //console.log(num);

    let sun_ran = getRandomInt(-2, 20); // variation for clouds
    let temp_ran = getRandomInt(-3, 6); // variation for temp

    let sun_val = sun_ran + clamp(Math.floor(num * 100), 2, 80);
    let temp_val = temp_ran + clamp(Math.floor(num * 100), 10, 90);


    let water_val = clamp((water["number"] - getRandomInt(2, 8)), 0, 100); // plants drink the water and reduce it


    bar_update("water", water_val);
    bar_update("sun", sun_val);
    bar_update("temp", temp_val);

}


function water_plant() {
    // adds water to the water bar
    let water = stats["water"];
    let water_val = clamp((water["number"] + getRandomInt(40, 60)), 0, 100);
    bar_update("water", water_val);
}



