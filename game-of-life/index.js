let dims = [10, 10];
let cells;
let currentGen, nextGen;
let DELAY_MS = 500;
let ALIVE_PROBABILITY = 0.5;
let paused = false;
const libModal = new bootstrap.Modal(document.getElementById('library-modal'));

const initPickr = () => {
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
}

const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const getNeighbourStates = (x, y) => {
    const states = {
        live: 0,
        dead: 0
    };
    if (y - 1 >= 0) currentGen[dims[1] * (y - 1) + x] === 0 ? states.dead++ : states.live++;
    if (y - 1 >= 0 && x - 1 >= 0) currentGen[dims[1] * (y - 1) + x - 1] === 0 ? states.dead++ : states.live++;
    if (y - 1 >= 0 && x + 1 < dims[1]) currentGen[dims[1] * (y - 1) + x + 1] === 0 ? states.dead++ : states.live++;
    if (y + 1 < dims[0] && x - 1 >= 0) currentGen[dims[1] * (y + 1) + x - 1] === 0 ? states.dead++ : states.live++;
    if (y + 1 < dims[0] && x + 1 < dims[1]) currentGen[dims[1] * (y + 1) + x + 1] === 0 ? states.dead++ : states.live++;
    if (x + 1 < dims[1]) currentGen[dims[1] * y + x + 1] === 0 ? states.dead++ : states.live++;
    if (x - 1 >= 0) currentGen[dims[1] * y + x - 1] === 0 ? states.dead++ : states.live++;
    if (y + 1 < dims[0]) currentGen[dims[1] * (y + 1) + x] === 0 ? states.dead++ : states.live++;
    return states;
}

const initGrid = (dims, random = false) => {
    currentGen = [];
    document.querySelector('.container').innerHTML = '';
    for (let i = 0; i < dims[0] * dims[1]; i++) {
        const div = document.createElement('div');
        const rand = random ? Math.random() < ALIVE_PROBABILITY ? 0 : 1 : 0;
        currentGen.push(rand);
        div.setAttribute('data-state', rand);
        document.querySelector('.container').append(div);
        div.addEventListener('click', () => {
            const state = Number(!Number(div.dataset.state))
            div.dataset.state = state;
            currentGen[i] = state;
        });
    }
    cells = document.querySelectorAll('.container div');
}

const simulate = async () => {
    while (true) {
        let changes = 0;
        nextGen = [...currentGen];
        await delay(DELAY_MS);
        currentGen.forEach(async (cell, i) => {
            const x = i % dims[1];
            const y = Math.floor(i / dims[1]);
            const neighbours = getNeighbourStates(x, y);
            if (cell === 0 && neighbours.live === 3) {
                nextGen[i] = 1;
                cells[i].dataset.state = 1;
                changes++;
            } else if (cell === 1 && neighbours.live !== 2 && neighbours.live !== 3) {
                nextGen[i] = 0;
                cells[i].dataset.state = 0;
                changes++;
            }
        });
        currentGen = nextGen;
        if (changes === 0 || paused) break;
    }
    console.log('ended');
}

const setDims = function (
    rows = window.getComputedStyle(document.documentElement).getPropertyValue('--rows'),
    cols = window.getComputedStyle(document.documentElement).getPropertyValue('--cols')
) {
    dims = [rows, cols];
    document.documentElement.style.setProperty('--rows', rows);
    document.documentElement.style.setProperty('--cols', cols);
}

const setDelay = function () {
    DELAY_MS = this.value;
}

const setProbability = function () {
    ALIVE_PROBABILITY = this.value;
}

const play = () => {
    paused = false;
    simulate();
}

const pause = () => paused = true;

const clearGrid = () => {
    pause();
    setTimeout(() => {
        cells.forEach((div) => div.dataset.state = 0);
        currentGen = new Array(dims[0] * dims[1]).fill(0);
        nextGen = [];
    }, DELAY_MS);
}

const loadPattern = (img) => {
    const { rows, cols, live } = img.dataset;
    setDims(rows, cols);
    initGrid(dims);
    live.split(',').forEach((idx) => {
        cells[idx].dataset.state = 1;
        currentGen[idx] = 1;
    });
}

document.querySelector('#rows').addEventListener('input', function () {
    setDims(this.value);
    initGrid(dims, true);
});
document.querySelector('#cols').addEventListener('input', function () {
    setDims(undefined, this.value);
    initGrid(dims, true);
});
document.querySelector('#delay').addEventListener('input', setDelay);
document.querySelector('#liveProbability').addEventListener('input', setProbability);
document.querySelector('#play').addEventListener('click', play);
document.querySelector('#pause').addEventListener('click', pause);
document.querySelector('#clear').addEventListener('click', clearGrid);
document.querySelectorAll('#library-modal img').forEach(img => {
    img.addEventListener('click', () => {
        loadPattern(img);
        libModal.hide();
    });
});

initPickr();
initGrid(dims, true);
simulate();
