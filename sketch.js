var cellSize = 24;
var tookOfStack = false;
var start;

var grid = [],
    stack = [],
    rows,
    cols,
    current;

let cellsvisited = 1;
function setup() {
    frameRate(5);

    createCanvas(windowWidth, windowHeight);

    rows = floor(height / cellSize);
    cols = floor(width / cellSize);

    colorMode(RGB);

    if (cellSize < 15) cellSize = 15;

    createCanvas(windowWidth, windowHeight);

    buildGrid();

    current =
        grid[
            index(
                floor(random(0, rows - rows / 4)),
                floor(random(0, cols - cols / 4))
            )
        ];

    current.visited = true;

    start = current;
}

function draw() {
    if (cellsvisited === rows * cols) frameRate(0);

    background(57, 28, 130);

    for (let i = 0; i < rows * cols; i++) {
        grid[i].show(cellSize);
    }

    if (current && !current.visited) {
        current.visited = true;
        cellsvisited++;
        ab = current;
    }

    let next = current.checkNeighbors();

    if (next) {
        current.highLight();
        stack.push(current);
        current.removeWalls(next);
        current = next;
        tookOfStack = false;
    } else if (stack.length > 0) {
        current.highLight();
        current = stack.pop();
        tookOfStack = true;
    }
}

function buildGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid.push(new Cell(col, row));
        }
    }
}

function Cell(x, y) {
    this.x = x;
    this.y = y;

    this.walls = {
        top: true,
        right: true,
        bottom: true,
        left: true,
    };

    this.visited = false;
    this.colorValue = this.colorValueMin = 150;
    this.colorValueMax = 255;
    this.colorMode = true;

    this.checkNeighbors = function () {
        let top = grid[index(this.x, this.y - 1)];
        let right = grid[index(this.x + 1, this.y)];
        let bottom = grid[index(this.x, this.y + 1)];
        let left = grid[index(this.x - 1, this.y)];

        let neighbors = [];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        var random = floor(Math.random() * neighbors.length);
        return neighbors[random];
    };

    this.removeWalls = function (next) {
        let x = this.x - next.x,
            y = this.y - next.y;

        if (x === 1) {
            this.walls.left = false;
            next.walls.right = false;
        } else if (x === -1) {
            next.walls.left = false;
            this.walls.right = false;
        }

        if (y === 1) {
            this.walls.top = false;
            next.walls.bottom = false;
        } else if (y === -1) {
            next.walls.top = false;
            this.walls.bottom = false;
        }
    };

    this.show = function () {
        if (this.colorMode) {
            this.colorValue++;
        } else {
            this.colorValue--;
        }

        if (
            this.colorValue === this.colorValueMin ||
            this.colorValue === this.colorValueMax
        ) {
            this.colorMode = !this.colorMode;
        }

        stroke(255);

        let y = this.y * cellSize + 2;
        let x = this.x * cellSize + 2;

        if (this.walls.top && this.visited) {
            line(x, y, x + cellSize, y);
        }

        if (this.walls.right && this.visited) {
            line(x + cellSize, y, x + cellSize, y + cellSize);
        }

        if (this.walls.bottom && this.visited) {
            line(x, y + cellSize, x + cellSize, y + cellSize);
        }

        if (this.walls.left && this.visited) {
            line(x, y + cellSize, x, y);
        }

        if (this.visited) {
            noStroke();

            if (this === start) {
                fill(0, 0, 255, 20);
            } else {
                fill(this.colorValue, 0, this.colorValue, 150);
            }
            rect(x, y, cellSize, cellSize);
        }
    };

    this.highLight = function () {
        let x = this.x * cellSize + 2;
        let y = this.y * cellSize + 2;
        noStroke();

        if (tookOfStack) {
            fill("red");
        } else {
            fill(50, 205, 50);
        }

        rect(x, y, cellSize, cellSize);
    };
}
function index(x, y) {
    if (x < 0 || y < 0 || x > cols - 1 || y > rows - 1) {
        return -1;
    }

    return x + y * cols;
}
