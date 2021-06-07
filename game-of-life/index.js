let dims = [10, 10];
let cells;
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
    cells = document.querySelectorAll('.container div');
    if (y - 1 >= 0 && x - 1 >= 0 && x + 1 < dims[0] && y + 1 < dims[1]) {
        cells[dims[1] * (y - 1) + x].dataset.state === '0' ? states.dead++ : states.live++;
        cells[dims[1] * (y + 1) + x].dataset.state === '0' ? states.dead++ : states.live++;
        cells[dims[1] * y + x - 1].dataset.state === '0' ? states.dead++ : states.live++;
        cells[dims[1] * y + x + 1].dataset.state === '0' ? states.dead++ : states.live++;
        cells[dims[1] * (y - 1) + x - 1].dataset.state === '0' ? states.dead++ : states.live++;
        cells[dims[1] * (y - 1) + x + 1].dataset.state === '0' ? states.dead++ : states.live++;
        cells[dims[1] * (y + 1) + x - 1].dataset.state === '0' ? states.dead++ : states.live++;
        cells[dims[1] * (y + 1) + x + 1].dataset.state === '0' ? states.dead++ : states.live++;
    }
    return states;
}

const initGrid = (rows, cols) => {
    document.querySelector('.container').innerHTML = '';
    for (let i = 0; i < rows * cols; i++) {
        const div = document.createElement('div');
        const rand = Math.random() < ALIVE_PROBABILITY ? 0 : 1;
        div.setAttribute('data-state', rand.toString());
        document.querySelector('.container').append(div);
    }
}

const simulate = async () => {
    cells = document.querySelectorAll('.container div');
    while (true) {
        let changes = 0;
        await delay(DELAY_MS);
        cells.forEach(async (cell, i) => {
            const x = i % dims[0];
            const y = Math.floor(i / dims[1]);
            const { state } = cell.dataset;
            const neighbours = getNeighbourStates(x, y);
            if (state === '0' && neighbours.live === 3) {
                cell.dataset.state = 1;
                changes++;
            } else if (state === '1' && neighbours.live !== 2 && neighbours.live !== 3) {
                cell.dataset.state = 0;
                changes++;
            }
        });
        if (changes === 0 || paused) break;
    }
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
    cells.forEach((div) => {
        div.dataset.state = 0;
    });
});

initGrid(dims[0], dims[1]);
simulate();
