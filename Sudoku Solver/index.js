
const gridContainer = document.getElementById('sudoku-grid');

// Generate Grid
for (let i = 0; i < 9; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < 9; j++) {
        const cell = document.createElement('input');
        cell.type = 'number';
        cell.min = 1;
        cell.max = 9;
        cell.maxLength = 1;
        cell.className = 'cell';
        row.appendChild(cell);
    }
    gridContainer.appendChild(row);
}

// Function to clear the grid
function clear_grid() {
    const gridContainer = document.getElementById('sudoku-grid');
    const cells = gridContainer.querySelectorAll('.cell');

    cells.forEach(function(cell) {
        cell.value = '';
    });
}

function valid_grid(grid){
    let isValid = true;
    for(let i = 0; i <9; i++){
        const Visited = new Set();
        for(let j = 0; j <9; j++){
            if(grid[i][j] === 0) continue;
            if(grid[i][j] > 9 || grid[i][j] < 1) {
                isValid = false;
            }
            if(Visited.has(grid[i][j])){
                isValid = false;
                console.log("row check")
            } else {
                Visited.add(grid[i][j])
            }
        } 

    }

    for(let i = 0; i <9; i++){
        const Visited = new Set();
        for(let j = 0; j <9; j++){
            if(grid[j][i] === 0) continue;
            
            if(Visited.has(grid[j][i])){
                isValid = false;
                console.log("col check")
            } else {
                Visited.add(grid[j][i])
            }
        } 

    }

    /* Now we must check each 3x3 Sudoku to make sure they dont contain the same elemet */
    /* i,j is the top left of the 3x3 grid */
    function check_three(i,j) {
        const Visited = new Set();
        
        for(let x = i; x <(i + 3); x++){
            for(let y = j; y <(j + 3); y++){
                if(grid[x][y] === 0) continue;
                if(Visited.has(grid[x][y])){
                    return false;
                } else {
                    Visited.add(grid[x][y])
                }
            }
        }
        return true;
    }

    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            if (!check_three(i, j)) {
                isValid = false;
                console.log("row check");
            }
        }
    }

    return isValid;
}

function valid_row(grid, r) {
    const Visited = new Set()
    for(let i = 0; i < 9; i++){
        if(grid[r][i] === 0) continue;
        if(Visited.has(grid[r][i])){
            return false;
        }
        if(grid[r][i] > 9 || grid[r][i] < 1) {
            return false;
        }
        else{
            Visited.add(grid[r][i])
        }
    }
    return true;
}

function valid_column(grid, c) {
    const Visited = new Set()
    for(let i = 0; i < 9; i++){
        if(grid[i][c] === 0) continue;
        if(Visited.has(grid[i][c])){
            return false;
        }
        if(grid[i][c] > 9 || grid[i][c] < 1) {
            return false;
        }
        else{
            Visited.add(grid[i][c])
        }
    }
    return true;
}

function check_three(grid, r, c) {
    const Visited = new Set();
    i = 3*(Math.floor(r/3));
    j = 3*(Math.floor(c/3));

    for(let x = i; x <(i + 3); x++){
        for(let y = j; y <(j + 3); y++){
            if(grid[x][y] === 0) continue;
            if(Visited.has(grid[x][y])){
                return false;
            } else {
                Visited.add(grid[x][y])
            }
        }
    }
    return true;
}

function updateGrid() {
    const rows = document.querySelectorAll("#sudoku-grid .row");

    rows.forEach((row, i) => {
        const cells = row.querySelectorAll('.cell');
        cells.forEach((cell, j) => {
        // Assuming '0' represents an empty cell in your matrix
        cell.value = grid[i][j] !== 0 ? grid[i][j] : '';
    });
    });
}

function generate_valid_sudoku() {
    /* First step is to make every entry empty */
    clear_grid();
    // i, represents how many numbers are in each recursive call
    grid = []
    for(let i = 0; i < 9; i++){
        let row = [];
        for(let j = 0; j < 9; j++){
            row.push(0);
        }
        grid.push(row);
    }

   // Function to fill 2 cells in each 3x3 subgrid
   for (let x = 0; x < 9; x += 3) {
    for (let y = 0; y < 9; y += 3) {
        fill_two_cells_in_subgrid(grid, x, y);
    }
    }
    console.log(grid)

    const rows = document.querySelectorAll("#sudoku-grid .row");

    rows.forEach((row, i) => {
        const cells = row.querySelectorAll('.cell');
        cells.forEach((cell, j) => {
        // Assuming '0' represents an empty cell in your matrix
        cell.value = grid[i][j] !== 0 ? grid[i][j] : '';
    });
});
}

function fill_two_cells_in_subgrid(grid, rowStart, colStart) {
    let filled = 0;
    let attempts = 0;
    while (filled < 2 && attempts < 50) { // Limit attempts to avoid infinite loop
        let row = rowStart + Math.floor(Math.random() * 3);
        let col = colStart + Math.floor(Math.random() * 3);

        if (grid[row][col] === 0) {
            let num = Math.floor(Math.random() * 9) + 1;
            grid[row][col] = num; // Assign the number first

            // Check if the grid is valid after assignment
            if (valid_row(grid, row) && valid_column(grid, col) && check_three(grid, row, col)) {
                filled++;
            } else {
                grid[row][col] = 0; // Reset if invalid
            }
        }
        attempts++;
    }
}




// Functions checks if the current sudoku is valid
function validate_sudoku() {
    /* Construct a grid, based on the html elements*/
    const gridContainer = document.getElementById('sudoku-grid');
    grid = []
    let isValid = true;

    for(let i = 0; i < 9; i++){
        const row = document.querySelectorAll('.row')[i];
        const cells = row.querySelectorAll('.cell');
        const gridRow = Array.from(cells).map(cell => cell.value ? parseInt(cell.value) : 0);
        grid.push(gridRow);
    }

    console.log(grid);

    /* We now have a grid which we can perform our checks on */
    /*check the rows*/
    isValid = valid_grid(grid);

    const cells = document.querySelectorAll('.cell');

    // Apply color to each cell based on the validation result
    const color = isValid ? '#15b800' : '#ff0101';
    cells.forEach(cell => {
        cell.style.backgroundColor = color;
    });

    // Reset the color after a brief period
    setTimeout(() => {
        cells.forEach(cell => {
            cell.style.backgroundColor = ''; // Reset to original color
        });
    }, 1000); // Duration in milliseconds (1000ms = 1 second)

    return isValid;

}


function solve_sudokuer() {
    const gridContainer = document.getElementById('sudoku-grid');
    grid = []

    for(let i = 0; i < 9; i++){
        const row = document.querySelectorAll('.row')[i];
        const cells = row.querySelectorAll('.cell');
        const gridRow = Array.from(cells).map(cell => cell.value ? parseInt(cell.value) : 0);
        grid.push(gridRow);
    }

    function solve_sudoku(grid, r = 0, c = 0) {
        return new Promise(async resolve => { // Note the async here
            if (c === 9) {
                r++;
                c = 0;
            }
            if (r === 9) {
                resolve(true); // Sudoku solved
                return;
            }
    
            setTimeout(async () => { // Async here as well
                updateGrid();
                if (grid[r][c] === 0) {
                    for (let i = 1; i <= 9; i++) {
                        grid[r][c] = i;
                        if (valid_row(grid, r) && valid_column(grid, c) && check_three(grid, r, c)) {
                            const result = await solve_sudoku(grid, r, c + 1);
                            if (result) {
                                resolve(true); // Found a valid number, move to next cell
                                return;
                            }
                        }
                        grid[r][c] = 0; // Backtrack if number i doesn't lead to a solution
                    }
                    resolve(false); // After trying all numbers, trigger backtracking
                } else {
                    const result = await solve_sudoku(grid, r, c + 1);
                    resolve(result); // Move to the next cell if current cell is already filled
                }
            }, 10); // Delay in milliseconds
        });
    }
    
    solve_sudoku(grid).then(result => {
        if (result) {
            console.log("Sudoku solved!");
            updateGrid(); // Update the grid one last time to show the solved state
        } else {
            console.log("No solution found.");
        }
    });
    
    
}

