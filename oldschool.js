document.addEventListener("DOMContentLoaded", () => {
    render(grid());
  });

  function createCell(cell, grid) {
    let li = document.createElement("li");
    li.dataset.row = cell.row;
    li.dataset.column = cell.column;
    li.dataset.isMine = cell.isMine;
    li.dataset.isRevealed = cell.isRevealed;
    li.dataset.nearMine = cell.mineCount !== 0;
    li.innerHTML = cell.mineCount;
    li.addEventListener("click", () => {
      grid[cell.row][cell.column].isRevealed = true;
      if (cell.mineCount === 0) {
        grid = revealZeros(cell, grid);
      }
      if (cell.isMine) {
        grid = revealAll(grid);
      }
      render(grid);
    });
    return li;
  }
  function render(grid) {
    const boardGrid = document.getElementsByClassName("grid")[0];
    boardGrid.innerHTML = "";
    for (let row of grid) {
      let list = document.createElement("ul");
      for (let cell of row) {
        let li = createCell(cell, grid);
        list.appendChild(li);
      }
      boardGrid.appendChild(list);
    }
  }
  function revealAll(grid) {
    for (let row of grid) {
      for (let cell of row) {
        cell.isRevealed = true;
      }
    }
    return grid;
  }
  function revealZeros(cell, grid) {
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let newX = cell.row + j;
        let newY = cell.column + i;
        let newCell = grid[newX] && grid[newX][newY];
        if (!newCell) {
          continue;
        }
        if (newCell.mineCount === 0 && !newCell.isRevealed & !newCell.isMine) {
          grid[newX][newY].isRevealed = true;
          grid = revealZeros(newCell, grid);
        }
      }
    }
    return grid;
  }
  function placeMines(mineCount, size) {
    let positions = [];

    for (let i = 0; i < mineCount; i++) {
      let row = Math.floor(Math.random() * size);
      let column = Math.floor(Math.random() * size);
      if (positions.includes([row, column])) {
        i--;
        continue;
      }
      positions.push([row, column]);
    }
    console.log(positions)
    return positions;
  }
  function setMineIsExists(size, positions, cell) {
    let grid = [];
    for (i = 0; i < size; i++) {
      let row = [];
      for (j = 0; j < size; j++) {
        const exists = positions.some(
          (position) => position[0] === i && position[1] === j
        );
        row.push({ ...cell, row: i, column: j, isMine: exists });
      }
      grid.push(row);
      row = [];
    }
    return grid;
  }
  function setMineCounts(grid) {
    for (let row in grid) {
      for (let column in grid[row]) {
        let cell = grid[row][column];
        if (cell.isMine) {
          continue;
        }
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            let newX = cell.row + i;
            let newY = cell.column + j;
            let newCell = grid[newX] && grid[newX][newY];
            if (newCell && newCell.isMine) {
              cell.mineCount++;
            }
          }
        }
        grid[row][column] = cell;
      }
    }
    return grid;
  }
  function grid() {
    const size = 20;
    const mineCount = 40;
    const cell = {
      row: 0,
      column: 0,
      isMine: false,
      isFlagged: false,
      isRevealed: false,
      mineCount: 0,
    };
    let positions = placeMines(mineCount, size);
    let grid = setMineIsExists(size, positions, cell);
    return setMineCounts(grid);
  }
