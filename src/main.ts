import { MINE_COUNT, SIZE } from './constants';
import './style.css'
import { Cell, Grid } from './types';

const ELEMENT = document.getElementsByClassName("grid")[0] as HTMLElement;
const CELL: Cell = {
  row: 0,
  column: 0,
  mineCount: 0,
  isMine: false,
  isFlagged: false,
  isRevealed: false
}

class Game {
  grid: Grid = [];
  positions: number[][] = [];
  render() {
    this.setMinePositions();
    this.buildGrid();
    this.renderBoard();
    this.setMineCounts();
  }
  renderBoard() {
    ELEMENT.innerHTML = '';
    for (let row of this.grid) {
      let list = document.createElement('ul');
      for (let cell of row) {
        let li = this.createCell(cell);
        list.appendChild(li);
      }
      ELEMENT.appendChild(list);
    }
  }
  createCell(cell: Cell): HTMLElement {
    let li = document.createElement('li');
    li.dataset.row = cell.row.toString();
    li.dataset.column = cell.column.toString();
    li.dataset.isMine = cell.isMine.toString();
    li.dataset.isRevealed = cell.isRevealed.toString();
    li.dataset.nearMine = cell.mineCount !== 0 ? 'true' : 'false';
    if (cell.mineCount > 0) {
      li.innerHTML = cell.mineCount.toString();
    }
    li.addEventListener('click', () => this.handleCellClick(cell));
    return li;
  }
  handleCellClick(cell: Cell): void {
    this.grid[cell.row][cell.column].isRevealed = true;
    if (cell.mineCount === 0) {
      this.showZeros(cell);
    }
    if (cell.isMine) {
      this.gameOver();
    }
    this.renderBoard();
  }
  showZeros(cell: Cell): void {
    this.neighborCells(cell, (newCell) => {
      if (newCell.mineCount === 0 && !newCell.isRevealed && !newCell.isMine) {
        newCell.isRevealed = true;
        this.showZeros(newCell);
      }
      if (newCell.mineCount> 0) {
        newCell.isRevealed = true;
      }
    });
  }
  gameOver() {
    for (let row of this.grid) {
      for (let cell of row) {
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      }
    }
  }
  setMineCounts(): void {
    for (let row in this.grid) {
      for (let column in this.grid[row]) {
        let cell = this.grid[row][column];
        if (cell.isMine) {
          continue;
        }
        this.neighborCells(cell, (neighbor) => {
          if (neighbor.isMine) cell.mineCount++;
        });

        this.grid[row][column] = cell;
      }
    }
  }
  setMinePositions(): void {
    for (let i = 0; i < MINE_COUNT; i++) {
      let row = Math.floor(Math.random() * SIZE);
      let column = Math.floor(Math.random() * SIZE);
      if (this.positions.includes([row, column])) {
        i--;
        continue;
      }
      this.positions.push([row, column]);
    }
  }
  buildGrid(): void {
    for (let row = 0; row < SIZE; row++) {
      let rows = [];
      for (let column = 0; column < SIZE; column++) {
        rows.push({
          ...CELL,
          row: row,
          column: column,
          isMine: this.positions.some((position) => position[0] === row && position[1] === column)
        })
      }
      this.grid.push(rows);
      rows = [];
    }
  }
  neighborCells(cell: Cell, callback: (neighbor: Cell) => void): void {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        let newRow = cell.row + i;
        let newColumn = cell.column + j;
        let newCell = this.grid[newRow]?.[newColumn];
        if (newCell) callback(newCell);
      }
    }
  }
}

const game = new Game();
game.render();
