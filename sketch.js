let grid = [];
let stack = [];
let cellWidth = 25;
let rows, cols;
let current;
let slider;
let visitCounter = 0;
let totalCells;

function setup() {
    frameRate(100);

    createCanvas(windowWidth, windowHeight - 20);

    slider = createSlider(1, 1000, 1);
    slider.style("width", "100px");

    rows = floor(height / cellWidth);
    cols = floor(width / cellWidth);
    totalCells = rows * cols;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid.push(new Cell(col, row));
        }
    }

    current = grid[0];
    current.visited = true;
    visitCounter++;
    current.getNeighbour();

    document.title = "Maze: Progress...";
}

function draw() {
    background(0);

    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    for (let i = 0; i < slider.value(); i++) {
        let next = current.getNeighbour();
        if (next) {
            next.visited = true;
            visitCounter++;

            stack.push(current);

            current.removeWalls(next);

            current = next;
        } else if (stack.length > 0) {
            let found = false;

            while (!found) {
                let val = stack.pop();
                if (val.relpos[0] === 0 && val.relpos[1] === 0) {
                    found = true;
                    current = val;
                } else if (val.getNeighbour()) {
                    found = true;
                    current = val;
                }
            }
        }
    }
    //100 / 10
    document.title = "Maze: " + floor((visitCounter / totalCells) * 100) + " %";
}
function index(x, y) {
    if (x < 0 || y < 0 || x > cols - 1 || y > rows - 1) {
        return -1;
    }

    return x + y * cols;
}

class Cell {
    constructor(x, y) {
        this.relpos = [x, y];
        this.x = x * cellWidth;
        this.y = y * cellWidth;
        this.walls = [true, true, true, true];
        this.visited = false;

        this.show = function () {
            stroke(0);
            strokeWeight(3);
            if (this.walls[0]) {
                //roof
                line(this.x, this.y, this.x + cellWidth, this.y);
            }
            if (this.walls[1]) {
                //right
                line(
                    this.x + cellWidth,
                    this.y,
                    this.x + cellWidth,
                    this.y + cellWidth
                );
            }
            if (this.walls[2]) {
                //bottom
                line(
                    this.x,
                    this.y + cellWidth,
                    this.x + cellWidth,
                    this.y + cellWidth
                );
            }
            if (this.walls[3]) {
                //left
                line(this.x, this.y, this.x, this.y + cellWidth);
            }

            if (this.visited) {
                if (current == this) {
                    fill("blue");
                } else {
                    fill("violet");
                }
                noStroke();
                rect(this.x, this.y, cellWidth, cellWidth);
            }
        };
    }
    getNeighbour() {
        let top = grid[index(this.relpos[0], this.relpos[1] - 1)];
        let right = grid[index(this.relpos[0] + 1, this.relpos[1])];
        let bottom = grid[index(this.relpos[0], this.relpos[1] + 1)];
        let left = grid[index(this.relpos[0] - 1, this.relpos[1])];

        let neightbours = [];

        if (top && !top.visited) {
            neightbours.push(top);
        }
        if (right && !right.visited) {
            neightbours.push(right);
        }
        if (bottom && !bottom.visited) {
            neightbours.push(bottom);
        }
        if (left && !left.visited) {
            neightbours.push(left);
        }

        if (neightbours.length > 0) {
            let randomIndex = floor(random(0, neightbours.length));
            return neightbours[randomIndex];
        } else {
            return undefined;
        }
    }
    removeWalls(next) {
        let xMovement = this.relpos[0] - next.relpos[0];
        let yMovement = this.relpos[1] - next.relpos[1];

        //moved on x
        if (xMovement === 1) {
            this.walls[3] = false;
            next.walls[1] = false;
        } else if (xMovement === -1) {
            this.walls[1] = false;
            next.walls[3] = false;
        }
        //moved on y
        if (yMovement === 1) {
            this.walls[0] = false;
            next.walls[2] = false;
        } else if (yMovement === -1) {
            this.walls[2] = false;
            next.walls[0] = false;
        }
    }
}
