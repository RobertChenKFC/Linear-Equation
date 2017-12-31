let num;
let submit;
let tableInput;
let calculate;
let resultMatrix;

let rows;
let cols;

function setup() {
    num = select('#num');

    submit = select('#submit');
    submit.mousePressed(numChanged);

    tableInput = select('#tableInput');

    const canvas = select('#defaultCanvas0');
    if(canvas) canvas.remove(); // here too?

    calculate = select('#calculate');
    calculate.mousePressed(calcMatrix);

    MathJax.Hub.queue.Push(() => {
		resultMatrix = MathJax.Hub.getAllJax('resultMatrix')[0];
	});
}

function numChanged() {
    rows = Number(num.value());
    cols = rows + 1;
    
    const tableInputElem = document.getElementById('tableInput');
    while (tableInputElem.firstChild) tableInputElem.removeChild(tableInputElem.firstChild);

    const canvas = select('#defaultCanvas0');
    if(canvas) canvas.remove(); // strange!

    for(let i = 0; i < rows; i++) {
        const tableRow = createElement('tr');
        tableRow.parent(tableInput);
        for(let j = 0; j < cols; j++) {
            const elem = createElement('td');
            elem.parent(tableRow);

            const elemInput = createInput();
            elemInput.parent(elem);
            elemInput.id(toId(i, j));
        }
    }
}

let matrix;
function calcMatrix() {
    matrix = [];
    for(let i = 0; i < rows; i++) {
        matrix[i] = [];
        for(let j = 0; j < cols; j++) {
            const elem = select('#' + toId(i, j));
            matrix[i][j] = new Frac(Number(elem.value()));
        }
    }

    for(let b = 0; b < rows; b++) {
        const base = matrix[b][b].copy();

        if(base.q !== 0) {
            for(let j = 0; j < cols; j++) matrix[b][j].div(base);

            for(let i = 0; i < rows; i++) {
                if(i !== b) {
                    const ratio = matrix[i][b].copy();
                    for(let j = 0; j < cols; j++) matrix[i][j].sub(Frac.mult(matrix[b][j], ratio));
                }
            }
       }
    }

    let latex = '\\left[\\begin{array}{';
    for(let i = 0; i < rows; i++) latex += 'c';
    latex += '|c}';

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            latex += matrix[i][j].toLatex();

            if(j !== cols - 1) latex += '&';
        }
        if(i !== rows - 1) latex += '\\\\';
    }

    latex += '\\end{array}\\right]';

    MathJax.Hub.queue.Push(["Text", resultMatrix, latex]);	
}

function toId(i, j) {
    return i.toString() + ' ' + j.toString();
}