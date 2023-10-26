const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const width = canvas.width = 512;
const height = canvas.height = 512;

const cell_size = 2;
const cols = Math.floor(width / cell_size);
const rows = Math.floor(height / cell_size);

let grid_red = [];
let grid_green = [];
let grid_blue = [];

let color_red = false;
let color_green = false;
let color_blue = false;

const worley_point_count = 64;

let p = 0;

generate_noise();

function get_noise_type() {
    var ele = document.getElementsByName('noise');

    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked)
            return ele[i].value;
    }
}

function get_noise_colors() {
    color_red = document.getElementById('color_red').checked;
    color_green = document.getElementById('color_green').checked;
    color_blue = document.getElementById('color_blue').checked;
}

function generate_noise() {
    get_noise_colors();
    switch (get_noise_type()) {
        case "white_noise":
            grid_red = [];
            grid_green = [];
            grid_blue = [];
            if (color_red) {
                generate_white_noise(grid_red);
                console.log("Generated R");
            }
            if (color_green) {
                generate_white_noise(grid_green);
                console.log("Generated G");
            }
            if (color_blue) {
                generate_white_noise(grid_blue);
                console.log("Generated B");
            }
            break;
        case "worley_noise":
            grid_red = [];
            grid_green = [];
            grid_blue = [];
            if (color_red) {
                get_worley_noise(generate_worley_noise(grid_red));
                console.log("Generated R");
            }
            if (color_green) {
                get_worley_noise(generate_worley_noise(grid_green));
                console.log("Generated G");
            }
            if (color_blue) {
                get_worley_noise(generate_worley_noise(grid_blue));
                console.log("Generated B");
            }

            break;
        case "perlin_noise":
            grid_red = [];
            grid_green = [];
            grid_blue = [];
            if (color_red) {
                grid_red = generate_perlin_noise();
                console.log("Generated R");
            }
            if (color_green) {
                grid_green = generate_perlin_noise();
                console.log("Generated G");
            }
            if (color_blue) {
                grid_blue = generate_perlin_noise();
                console.log("Generated B");
            }
            break
        case "value_noise":
            grid_red = [];
            grid_green = [];
            grid_blue = [];
            if (color_red) {
                grid_red = generate_value_noise();
                console.log("Generated R");
            }
            if (color_green) {
                grid_green = generate_value_noise();
                console.log("Generated G");
            }
            if (color_blue) {
                grid_blue = generate_value_noise();
                console.log("Generated B");
            }
            break;
    }

    vals_to_hex();
}

function vals_to_hex() {
    let grid = [];
    for (let c = 0; c < cols; c++) {
        grid[c] = [];
        for (let r = 0; r < rows; r++) {
            grid[c][r] = "#";

            if ((color_red ? 1 : 0) + (color_green ? 1 : 0) + (color_blue ? 1 : 0) == 1) {
                if (color_red) {
                    grid[c][r] += (color_red ? get_hex(grid_red[c][r]) : "00");
                    grid[c][r] += (color_red ? get_hex(grid_red[c][r]) : "00");
                    grid[c][r] += (color_red ? get_hex(grid_red[c][r]) : "00");
                } else if (color_green) {
                    grid[c][r] += (color_green ? get_hex(grid_green[c][r]) : "00");
                    grid[c][r] += (color_green ? get_hex(grid_green[c][r]) : "00");
                    grid[c][r] += (color_green ? get_hex(grid_green[c][r]) : "00");
                } else {
                    grid[c][r] += (color_blue ? get_hex(grid_blue[c][r]) : "00");
                    grid[c][r] += (color_blue ? get_hex(grid_blue[c][r]) : "00");
                    grid[c][r] += (color_blue ? get_hex(grid_blue[c][r]) : "00");
                }
            } else {
                grid[c][r] += (color_red ? get_hex(grid_red[c][r]) : "00");
                grid[c][r] += (color_green ? get_hex(grid_green[c][r]) : "00");
                grid[c][r] += (color_blue ? get_hex(grid_blue[c][r]) : "00");
            }
        }
    }
    console.log(grid);
    draw_grid(grid);
}

function get_hex(val) {
    let hex = Math.floor(255 * val).toString(16);
    if (hex.length <= 1) {
        hex = "0" + hex;
    }
    return hex;
}

function draw_grid(grid) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            context.fillStyle = grid[c][r];
            context.fillRect(c * cell_size, r * cell_size, cell_size, cell_size);
        }
    }
}

function generate_white_noise(array) {
    for (let c = 0; c < cols; c++) {
        array[c] = [];
        for (let r = 0; r < rows; r++) {
            array[c][r] = Math.random();
        }
    }
}

function generate_worley_noise(array) {
    let worley_points = [];
    for (let i = 0; i < worley_point_count; i++) {
        worley_points[i] = [Math.floor(Math.random() * cols), Math.floor(Math.random() * rows)];
    }

    for (let c = 0; c < cols; c++) {
        array[c] = [];
        for (let r = 0; r < rows; r++) {
            let dists = [];
            for (let i = 0; i < worley_point_count; i++) {
                dists[i] = get_distance(c / cols, worley_points[i][0] / cols, r / rows, worley_points[i][1] / rows);
            }

            array[c][r] = dists.sort();
        }
    }

    return array;
}

function get_worley_noise(array) {
    const n = 0

    let max_dist = -1;

    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            array[c][r] = array[c][r][n];
            max_dist = Math.max(max_dist, array[c][r]);
        }
    }

    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            array[c][r] /= max_dist;
        }
    }

    return array;
}

function get_distance(x1, x2, y1, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}


function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t, a, b) {
    return a + t * (b - a);
}

function grad(hash, x, y) {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function perlin(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    const u = fade(x);
    const v = fade(y);

    const a = p[X] + Y;
    const b = p[X + 1] + Y;

    return lerp(v, lerp(u, grad(p[a], x, y), grad(p[b], x - 1, y)), lerp(u, grad(p[a + 1], x, y - 1), grad(p[b + 1], x - 1, y - 1)));
}

function generate_perlin_noise() {
    p = Array.from({ length: 512 }, () => Math.floor(Math.random() * 255));
    const noise = [];
    const scale = 0.1;
    for (let y = 0; y < rows; y++) {
        noise[y] = []
        for (let x = 0; x < cols; x++) {
            const value = (1 + perlin(x * scale, y * scale)) / 2;
            noise[y].push(value);
        }
    }
    return noise;
}

function generate_value_noise() {
    const noise = [];

    const grid = new Array(rows);
    for (let y = 0; y < rows; y++) {
        grid[y] = [];
        for (let x = 0; x < cols; x++) {
            grid[y][x] = Math.random(); 
        }
    }

    for (let y = 0; y < rows; y++) {
        noise[y] = []
        for (let x = 0; x < cols; x++) {
            const sampleX = x * (cols / (cols - 1));
            const sampleY = y * (rows / (cols - 1));

            const gridX = Math.min(Math.floor(sampleX), cols - 2); 
            const gridY = Math.min(Math.floor(sampleY), rows - 2);

            const dx = sampleX - gridX;
            const dy = sampleY - gridY;

            const value00 = grid[gridY][gridX];
            const value01 = grid[gridY][gridX + 1];
            const value10 = grid[gridY + 1][gridX];
            const value11 = grid[gridY + 1][gridX + 1];

            const interpolatedValue = (1 - dx) * (1 - dy) * value00 +
                dx * (1 - dy) * value01 +
                (1 - dx) * dy * value10 +
                dx * dy * value11;

            noise[y][x] = interpolatedValue;
        }
    }

    return noise;
}