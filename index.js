import { countBy, sum, sumBy, filter } from 'lodash';

function findDirectSolutionForRow(rowValues, solution, rowIndex) {
  // see if we can fill the whole row with X
  if (rowValues.length === 1 && rowValues[0] === 0) {
    solution[rowIndex] = solution.map(col => 'X');
  }
  // see if we can fill the whole row with O
  if (rowValues.length === 1 && rowValues[0] === solution.length) {
    solution[rowIndex] = solution.map(col => 'O');
  }
}

function findDirectSolutionForColumn(columnValues, solution, columnIndex) {
  // see if we can fill the whole column with X
  if (columnValues.length === 1 && columnValues[0] === 0) {
    solution.forEach((row, rowIndex) => solution[rowIndex][columnIndex] = 'X');
  }
  // see if we can fill the whole column with O
  if (columnValues.length === 1 && columnValues[0] === solution.length) {
    solution.forEach((row, rowIndex) => solution[rowIndex][columnIndex] = 'O');
  }
}

function isValidSolution(level, solution) {
  const { columns, rows } = level;

  const rowsValid = solution.every((row, index) => {
    const solutionOsInRow = sumBy(row, cell => cell === 'O');
    const expectedOsInRow = sum(rows[index]);
    return solutionOsInRow === expectedOsInRow;
  });

  if (!rowsValid) {
    return false;
  }

  for (let column = 0; column < columns.length; column++) {
    let solutionOsInColumn = 0;
    for (let row = 0; row < rows.length; row++) {
      if (solution[row][column] === 'O') {
        solutionOsInColumn++;
      }
    }

    const expectedOsInColumn = sum(columns[column]);
    if (solutionOsInColumn !== expectedOsInColumn) {
      return false;
    }
  }

  return true;
}

function fillInMissingCellsWithX(solution) {
  for (const row in solution) {
    for (let column = 0; column < solution[row].length; column++) { // can't foreach her for possible undefined
      const cell = solution[row][column];
      if (!cell) {
        solution[row][column] = 'X';
      }
    }
  }

  return solution;
}

export default function solve(level) {
  const { columns, rows } = level;

  if (columns.length !== rows.length) {
    throw new Error('COlumns and rows lengths must match');
  }

  // init nxn solution array
  let solution = [...Array(columns.length)];
  solution = solution.map(row => [...Array(columns.length)]);

  rows.forEach((row, index) => findDirectSolutionForRow(row, solution, index));
  columns.forEach((column, index) => findDirectSolutionForColumn(column, solution, index));

  if (isValidSolution(level, solution)) {
    return fillInMissingCellsWithX(solution);
  }
  return fillInMissingCellsWithX(solution);
}

export function prettyPrint(solution) {
  for (const row in solution) {
    for (const cell in solution[row]) {
      process.stdout.write(solution[row][cell] || ' ');
    }
    process.stdout.write('\n');
  }
}

/*
  const columns = [
    [3],
    [3],
    [3],
    [5],
    [3]
  ];
  const rows = [
    [1],
    [1],
    [5],
    [5],
    [5]
  ];

prettyPrint(solve(columns, rows));
*/
