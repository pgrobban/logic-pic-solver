import { countBy, sum, sumBy, filter } from 'lodash';

function isArrayConsecutive(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i + 1] !== arr[i] + 1) {
      return false;
    }
  }
  return true;
}

function columnToSolution(columnAsArray, columnIndex, solution) {
  for (let rowIndex = 0; rowIndex < solution.length; rowIndex++) {
    solution[rowIndex][columnIndex] = columnAsArray[rowIndex];
  }
}

function findDirectSolutionForRow(rowHints, solution, rowIndex) {
  // see if we can fill the whole row with X
  if (rowHints.length === 1 && rowHints[0] === 0) {
    solution[rowIndex] = solution.map(col => 'X');
    return;
  }
  // try solve simple case: eg rowHint [3] and solution row [X, undefined, O, undefined, X] then we can fill in like so [X, O, O, O, X]
  // first find the indices
  const knownXAndUnknownIndicesForRow = solution[rowIndex].reduce((accumulator, currentValue, currentIndex) => {
    if (currentValue !== 'X') {
      accumulator.push(currentIndex);
    }
    return accumulator;
  }, []);
  // if the indices are consecutive, then we know we have a unique solution
  if (rowHints[0] === knownXAndUnknownIndicesForRow.length && isArrayConsecutive(knownXAndUnknownIndicesForRow)) {
    // so we can replace all cells with those indices with O
    for (let i = 0; i < knownXAndUnknownIndicesForRow.length; i++) {
      solution[rowIndex][knownXAndUnknownIndicesForRow[i]] = 'O';
    }
  }
}

function findDirectSolutionForColumn(columnHints, solution, columnIndex) {
  // see if we can fill the whole row with X
  if (columnHints.length === 1 && columnHints[0] === 0) {
    solution.forEach((row, rowIndex) => {
      solution[rowIndex][columnIndex] = 'X';
    });
    return;
  }
  const columnAsArray = solution.map((row) => row[columnIndex]);
  // try solve simple case: eg rowHint [3] and solution row [X, undefined, O, undefined, X] then we can fill in like so [X, O, O, O, X]
  // first find the indices
  const knownXAndUnknownIndicesForColumn = columnAsArray.reduce((accumulator, currentValue, currentIndex) => {
    if (currentValue !== 'X') {
      accumulator.push(currentIndex);
    }
    return accumulator;
  }, []);
  // if the indices are consecutive, then we know we have a unique solution
  if (columnHints[0] === knownXAndUnknownIndicesForColumn.length && isArrayConsecutive(knownXAndUnknownIndicesForColumn)) {
    // so we can replace all cells with those indices with O
    for (let i = 0; i < knownXAndUnknownIndicesForColumn.length; i++) {
      columnAsArray[knownXAndUnknownIndicesForColumn[i]] = 'O';
    }
  }
  columnToSolution(columnAsArray, columnIndex, solution);
}

function isValidSolution(level, solution) {
  const { columnHints, rowHints } = level;

  const rowsValid = solution.every((row, index) => {
    const solutionOsInRow = sumBy(row, cell => cell === 'O');
    const expectedOsInRow = sum(rowHints[index]);
    return solutionOsInRow === expectedOsInRow;
  });

  if (!rowsValid) {
    return false;
  }

  for (let column = 0; column < columnHints.length; column++) {
    let solutionOsInColumn = 0;
    for (let row = 0; row < rowHints.length; row++) {
      if (solution[row][column] === 'O') {
        solutionOsInColumn++;
      }
    }

    const expectedOsInColumn = sum(columnHints[column]);
    if (solutionOsInColumn !== expectedOsInColumn) {
      return false;
    }
  }

  return true;
}

function fillPossibleOFromMiddlePlusOneToRight(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solution, rowIndex) {
  let cellIndex = foundFirstOCellIndex + 1;
  for (let cellsFilledWithPossibleO = 0;
    numberOfPossibleOToFillInOneDirection > 0 && cellsFilledWithPossibleO !== numberOfPossibleOToFillInOneDirection && cellIndex < solution.length;
    cellIndex++ , cellsFilledWithPossibleO++) {
    if (!solution[rowIndex][cellIndex]) {
      solution[rowIndex][cellIndex] = 'Possible O';
    }
  }

  // we know the rest is impossible so fill with X
  while (cellIndex < solution[rowIndex].length) {
    if (solution[rowIndex][cellIndex] !== 'O') {
      solution[rowIndex][cellIndex] = 'X';
    }
    cellIndex++;
  }
}

function fillPossibleOFromMiddleMinusOneToLeft(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solution, rowIndex) {
  let cellIndex = foundFirstOCellIndex - 1;

  for (let cellsFilledWithPossibleO = 0;
    numberOfPossibleOToFillInOneDirection >= 1 && // since we include middle
    cellIndex >= 0 && cellsFilledWithPossibleO !== numberOfPossibleOToFillInOneDirection && cellIndex < solution.length;
    cellIndex-- , cellsFilledWithPossibleO++) {
    if (!solution[rowIndex][cellIndex]) {
      solution[rowIndex][cellIndex] = 'Possible O';
    }
  }

  // we know the rest is impossible so fill with X
  while (cellIndex >= 0) {
    if (solution[rowIndex][cellIndex] !== 'O') {
      solution[rowIndex][cellIndex] = 'X';
    }
    cellIndex--;
  }
}

function fillPossibleOFromMiddlePlusOneToUpColumn(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solution, columnIndex) {
  const columnAsArray = solution.map((row) => row[columnIndex]);
  let cellIndex = foundFirstOCellIndex + 1;

  for (let cellsFilledWithPossibleO = 0;
    numberOfPossibleOToFillInOneDirection > 0 && cellsFilledWithPossibleO !== numberOfPossibleOToFillInOneDirection && cellIndex < solution.length;
    cellIndex++ , cellsFilledWithPossibleO++) {
    if (!columnAsArray[cellIndex]) {
      columnAsArray[cellIndex] = 'Possible O';
    }
  }

  // we know the rest is impossible so fill with X
  while (cellIndex < columnAsArray.length) {
    if (columnAsArray[cellIndex] !== 'O') {
      columnAsArray[cellIndex] = 'X';
    }
    cellIndex++;
  }

  columnToSolution(columnAsArray, columnIndex, solution);
}


function fillPossibleOFromMiddleMinusOneToDownColumn(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solution, columnIndex) {
  const columnAsArray = solution.map((row) => row[columnIndex]);
  let cellIndex = foundFirstOCellIndex - 1;

  // try to fill to left with possible Os
  for (let cellsFilledWithPossibleO = 0;
    numberOfPossibleOToFillInOneDirection > 0 && cellIndex >= 0 && cellsFilledWithPossibleO < numberOfPossibleOToFillInOneDirection;
    cellIndex-- , cellsFilledWithPossibleO++) {
    if (!columnAsArray[cellIndex]) {
      columnAsArray[cellIndex] = 'Possible O';
    }
  }

  // we know the rest is impossible so fill with X
  while (cellIndex >= 0) {
    if (columnAsArray[cellIndex] !== 'O') {
      columnAsArray[cellIndex] = 'X';
    }
    cellIndex--;
  }
  columnToSolution(columnAsArray, columnIndex, solution);
}

function fillImpossibleMovesForRow(rowHints, solution, rowIndex) {
  if (rowHints.length === 1) {
    if (rowHints[0] === 0) {
      solution[rowIndex] = solution[rowIndex].fill('X');
    } else {
      const foundFirstOCellIndex = solution[rowIndex].findIndex((cell) => cell === 'O');
      if (foundFirstOCellIndex !== -1) {
        const numberOfPossibleOToFillInOneDirection = rowHints[0] - 1;
        fillPossibleOFromMiddlePlusOneToRight(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solution, rowIndex);
        fillPossibleOFromMiddleMinusOneToLeft(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solution, rowIndex);

        solution[rowIndex].forEach((cell, cellIndex) => {
          if (cell === 'Possible O') {
            solution[rowIndex][cellIndex] = undefined;
          }
        });
      }
    }
  }
}

function fillImpossibleMovesForColumn(columnHints, solution, columnIndex) {
  if (columnHints.length === 1) {
    if (columnHints[0] === 0) {
      solution.forEach((row, rowIndex) => {
        solution[rowIndex][columnHints[0]] = 'X';
      });
    } else {
      const columnAsArray = solution.map((row) => row[columnIndex]);
      const foundFirstOCellIndex = columnAsArray.findIndex((cell) => cell === 'O');

      if (foundFirstOCellIndex !== -1) {
        const numberOfPossibleOToFillInOneDirection = columnHints[0] - 1;
        fillPossibleOFromMiddlePlusOneToUpColumn(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solution, columnIndex);
        fillPossibleOFromMiddleMinusOneToDownColumn(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solution, columnIndex);

        solution.forEach((row, rowIndex) => {
          if (row[columnIndex] === 'Possible O') {
            solution[rowIndex][columnIndex] = undefined;
          }
        });
      }
    }
  }
}


function fillInMissingCells(solution, fill = 'X') {
  for (const row in solution) {
    for (let column = 0; column < solution[row].length; column++) { // can't foreach here for possible undefined
      const cell = solution[row][column];
      if (!cell) {
        solution[row][column] = fill;
      }
    }
  }

  return solution;
}

export default function solve(level) {
  const { columnHints, rowHints } = level;

  if (columnHints.length !== rowHints.length) {
    throw new Error('COlumns and rows lengths must match');
  }

  // init nxn solution array
  let solution = [...Array(columnHints.length)];
  solution = solution.map(row => [...Array(columnHints.length)]);

  rowHints.forEach((row, index) => findDirectSolutionForRow(row, solution, index));
  columnHints.forEach((column, index) => findDirectSolutionForColumn(column, solution, index));

  if (isValidSolution(level, solution)) {
    return fillInMissingCells(solution, 'X');
  }


  rowHints.forEach((row, index) => fillImpossibleMovesForRow(row, solution, index));
  columnHints.forEach((column, index) => fillImpossibleMovesForColumn(column, solution, index));

  rowHints.forEach((row, index) => findDirectSolutionForRow(row, solution, index));
  columnHints.forEach((column, index) => findDirectSolutionForColumn(column, solution, index));

  if (isValidSolution(level, solution)) {
    return fillInMissingCells(solution, 'X');
  }

  console.log('Found no solution without guessing, returning partial solution');

  return fillInMissingCells(solution, '?');
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
