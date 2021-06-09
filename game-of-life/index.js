let dims = [10, 10];
let cells, next;
let DELAY_MS = 500;
let ALIVE_PROBABILITY = 0.5;
let paused = false;

const pickr = Pickr.create({
    el: '.pickr',
    theme: 'classic',
    conparison: false,
    swatches: null,
    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            hsla: true,
            hsva: false,
            cmyk: true,
            input: true,
            clear: false,
            save: false
        }
    }
});

pickr.on('change', (color, src, instance) => {
    const root = document.documentElement;
    root.style.setProperty('--color', color.toRGBA().toString());
    const [r, g, b, a] = color.toRGBA();
    root.style.setProperty('--h1-color', `rgb(${255 - r}, ${255 - g}, ${255 - b})`);
    instance.applyColor();
});

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const getNeighbourStates = (x, y) => {
    const states = {
        live: 0,
        dead: 0
    };
    if (y - 1 >= 0) cells[dims[1] * (y - 1) + x] === 0 ? states.dead++ : states.live++;
    if (y - 1 >= 0 && x - 1 >= 0) cells[dims[1] * (y - 1) + x - 1] === 0 ? states.dead++ : states.live++;
    if (y - 1 >= 0 && x + 1 < dims[1]) cells[dims[1] * (y - 1) + x + 1] === 0 ? states.dead++ : states.live++;
    if (y + 1 < dims[0] && x - 1 >= 0) cells[dims[1] * (y + 1) + x - 1] === 0 ? states.dead++ : states.live++;
    if (y + 1 < dims[0] && x + 1 < dims[1]) cells[dims[1] * (y + 1) + x + 1] === 0 ? states.dead++ : states.live++;
    if (x + 1 < dims[1]) cells[dims[1] * y + x + 1] === 0 ? states.dead++ : states.live++;
    if (x - 1 >= 0) cells[dims[1] * y + x - 1] === 0 ? states.dead++ : states.live++;
    if (y + 1 < dims[0]) cells[dims[1] * (y + 1) + x] === 0 ? states.dead++ : states.live++;
    return states;
}

const initGrid = (rows, cols) => {
    cells = [];
    document.querySelector('.container').innerHTML = '';
    for (let i = 0; i < rows * cols; i++) {
        const div = document.createElement('div');
        const rand = Math.random() < ALIVE_PROBABILITY ? 0 : 1;
        cells.push(rand);
        div.setAttribute('data-state', rand);
        document.querySelector('.container').append(div);
        div.addEventListener('click', () => {
            const state = Number(!Number(div.dataset.state))
            div.dataset.state = state;
            cells[i] = state;
        });
    }
}

const simulate = async () => {
    while (true) {
        let changes = 0;
        next = [...cells];
        await delay(DELAY_MS);
        cells.forEach(async (cell, i) => {
            const x = i % dims[1];
            const y = Math.floor(i / dims[1]);
            const neighbours = getNeighbourStates(x, y);
            if (cell === 0 && neighbours.live === 3) {
                next[i] = 1;
                document.querySelectorAll('.container div')[i].dataset.state = 1;
                changes++;
            } else if (cell === 1 && neighbours.live !== 2 && neighbours.live !== 3) {
                next[i] = 0;
                document.querySelectorAll('.container div')[i].dataset.state = 0;
                changes++;
            }
        });
        cells = next;
        if (changes === 0 || paused) break;
    }
    console.log('ended');
}

document.querySelector('#rows').addEventListener('input', function () {
    const root = document.documentElement;
    dims[0] = this.value;
    root.style.setProperty('--rows', this.value);
    initGrid(this.value, window.getComputedStyle(root).getPropertyValue('--cols'));
});

document.querySelector('#cols').addEventListener('input', function () {
    const root = document.documentElement;
    dims[1] = this.value;
    root.style.setProperty('--cols', this.value);
    initGrid(window.getComputedStyle(root).getPropertyValue('--rows'), this.value);
});

document.querySelector('#delay').addEventListener('input', function () {
    DELAY_MS = this.value;
});

document.querySelector('#liveProbability').addEventListener('input', function () {
    ALIVE_PROBABILITY = this.value;
});

document.querySelector('#play').addEventListener('click', () => {
    paused = false;
    simulate();
});

document.querySelector('#pause').addEventListener('click', () => paused = true);

document.querySelector('#clear').addEventListener('click', () => {
    document.querySelectorAll('.container div').forEach((div) => div.dataset.state = 0);
    cells = new Array(dims[0] * dims[1]).fill(0);
    next = [];
});

initGrid(dims[0], dims[1]);
simulate();
