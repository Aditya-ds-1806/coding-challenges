const dims = [10, 10];
const root = document.documentElement;
let cells;

// root.style.setProperty('--color', 'green');

const delay = function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
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

for (let i = 0; i < dims[0] * dims[1]; i++) {
    const div = document.createElement('div');
    const rand = Math.random() < 0.5 ? 0 : 1;
    div.setAttribute('data-state', rand.toString());
    document.querySelector('.container').append(div);
}

cells = document.querySelectorAll('.container div');

(async () => {
    while (true) {
        let changes = 0;
        await delay(500);
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
        if (changes === 0) break;
    }
    console.log('ended');
})();
