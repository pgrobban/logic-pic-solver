import { sum, sumBy, cloneDeep, isEqual } from 'lodash';
const DEBUG = 0;

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

function tryFindDirectSolutionForRow(rowHints, solution, rowIndex) {
  // see if we can fill the whole row with X
  if (rowHints.length === 1) {
    if (rowHints[0] === 0) {
      solution[rowIndex] = solution.map(col => 'X');
    } else {
      const numberOfOInRow = solution[rowIndex].filter((cell) => cell === 'O').length;
      if (numberOfOInRow === rowHints[0]) {
        const rowFilledUnknownWithX = solution[rowIndex].map((cell) => cell === 'O' ? 'O' : 'X');
        solution[rowIndex] = rowFilledUnknownWithX;
      }

      // handle case where hint is a number equal to the remaining unknowns in row and unknowns are consecutive, e.g. hint is [3] and row is [X, undefined, undefined, undefined, X]
      const notXCellIndices = solution[rowIndex].map((value, index) => ({ value, index })).filter((c) => c.value !== 'X').map((c) => c.index);
      if (notXCellIndices.length === rowHints[0] && isArrayConsecutive(notXCellIndices)) {
        for (let i = 0; i < notXCellIndices.length; i++) {
          solution[rowIndex][notXCellIndices[i]] = 'O';
        }
      }
    }
  }
  // handle cases [3, 1] => [O, O, O, X, O]. should also handle cases where hints has length 1 and equal to the column length, i.e. [5] => [O, O, O, O, O]
  const rowHintsSum = rowHints.reduce((accumulator, currentValue, currentIndex) => {
    return accumulator + currentValue + (currentIndex === rowHints.length - 1 ? 0 : 1);
  }, 0);
  if (rowHintsSum === solution[rowIndex].length) {
    let fillIndex = 0;
    for (let rowHintsIndex = 0; rowHintsIndex < rowHints.length; rowHintsIndex++) {
      for (let hintCell = 0; hintCell < rowHints[rowHintsIndex]; hintCell++) {
        solution[rowIndex][fillIndex] = 'O';
        fillIndex++;
      }
      if (fillIndex !== solution.length) {
        solution[rowIndex][fillIndex] = 'X';
      }
      fillIndex++;
    }
  }

  // see if we have any more unknown cells. can't use .find() for this cus it skips undefined
  let unknownCells = false;
  for (let cellIndex = 0; cellIndex < solution[rowIndex].length; cellIndex++) {
    if (!solution[rowIndex][cellIndex]) {
      unknownCells = true;
      break;
    }
  }
  if (unknownCells) {
    tryFindDirectIntervalSolutionRow(rowHints, solution, rowIndex);
  }
}

function tryFindDirectIntervalSolutionRow(rowHints, solution, rowIndex) {
  // find solutions in intervals
  const rowLength = solution[rowIndex].length;
  const xIntervalStartIndices = [-1];
  if (solution[rowIndex][0] !== 'X') { // ugly but maybe works?
    xIntervalStartIndices.push(-1);
  }
  solution[rowIndex].forEach((cell, cellIndex) => {
    if (cell === 'X') {
      xIntervalStartIndices.push(cellIndex);
    }
  });
  xIntervalStartIndices.push(rowLength); // pretend we have qan X at the start and end of the row
  xIntervalStartIndices.splice(0, 1);

  const lengthsOfIntervalsBetweenXs = xIntervalStartIndices.map((startOfIntervalIndex, index) => {
    if (index === 0) {
      return xIntervalStartIndices[index + 1];
    }
    return startOfIntervalIndex - 1 - xIntervalStartIndices[index - 1];
  }).filter(interval => interval !== 0);
  lengthsOfIntervalsBetweenXs.splice(0, 1);

  if (rowHints.length === lengthsOfIntervalsBetweenXs.length) {
    let xIntervalIndex = 0;
    for (let rowHintIndex = 0; rowHintIndex < rowHints.length; rowHintIndex++) {
      if (xIntervalStartIndices[rowHintIndex + 1] && (xIntervalStartIndices[rowHintIndex + 1] - xIntervalStartIndices[rowHintIndex] === 1)) {
        xIntervalIndex++;
        continue;
      }
      if (isEqual(rowHints[rowHintIndex], lengthsOfIntervalsBetweenXs[rowHintIndex])) {
        for (let cellToFillIndexOffsetFromStartOfInterval = 0; cellToFillIndexOffsetFromStartOfInterval < rowHints[rowHintIndex]; cellToFillIndexOffsetFromStartOfInterval++) {
          solution[rowIndex][xIntervalStartIndices[xIntervalIndex] + cellToFillIndexOffsetFromStartOfInterval + 1] = 'O';
        }
      }
      xIntervalIndex++;
    }
  }
}

function tryFindSequentialSolutionForRow(rowHints, solution, rowIndex) {
  // try solve simple case: eg rowHint [3] and solution row [X, undefined, O, undefined, X] then we can fill in like so [X, O, O, O, X]
  // first find the indices
  const knownXAndUnknownIndicesForRow = solution[rowIndex].reduce((accumulator, currentValue, currentIndex) => {
    if (currentValue !== 'X') {
      accumulator.push(currentIndex);
    }
    return accumulator;
  }, []);
  if (rowHints.length === 0) {
    // if the indices are consecutive, then we know we have a unique solution
    if (rowHints[0] === knownXAndUnknownIndicesForRow.length && isArrayConsecutive(knownXAndUnknownIndicesForRow)) {
      // so we can replace all cells with those indices with O
      for (let i = 0; i < knownXAndUnknownIndicesForRow.length; i++) {
        solution[rowIndex][knownXAndUnknownIndicesForRow[i]] = 'O';
      }
    }
  }
  // if we know there is an O one side, we can fill in some more known Os from the first hint
  if (solution[rowIndex][0] === 'O') {
    let cellIndex = 0;
    for (; cellIndex < rowHints[0]; cellIndex++) {
      solution[rowIndex][cellIndex] = 'O';
    }
    if (cellIndex !== solution[rowIndex].length) {
      solution[rowIndex][cellIndex] = 'X';
    }
  }

  const lastCellIndex = solution[rowIndex].length - 1;
  if (solution[rowIndex][lastCellIndex] === 'O') {
    const cellsToFill = rowHints[rowHints.length - 1];
    let cellIndex = lastCellIndex;
    for (; cellIndex > lastCellIndex - cellsToFill; cellIndex--) {
      solution[rowIndex][cellIndex] = 'O';
    }
    if (cellIndex >= 0) {
      solution[rowIndex][cellIndex] = 'X';
    }
  }
}

function tryFindDirectSolutionForColumn(columnHints, solution, columnIndex) {
  let columnAsArray = solution.map((row) => row[columnIndex]);
  if (columnHints.length === 1) {
    if (columnHints[0] === 0) {
      solution.forEach((row, rowIndex) => {
        solution[rowIndex][columnIndex] = 'X';
      });
    } else {
      const numberOfOInColumn = columnAsArray.filter((cell) => cell === 'O').length;
      if (numberOfOInColumn === columnHints[0]) {
        const columnFilledUnknownWithX = columnAsArray.map((cell) => cell === 'O' ? 'O' : 'X');
        columnAsArray = columnFilledUnknownWithX;
      }
      // handle case where hint is a number equal to the remaining unknowns in row and unknowns are consecutive, e.g. hint is [3] and row is [X, undefined, undefined, undefined, X]
      const notXCellIndices = columnAsArray.map((value, index) => ({ value, index })).filter((c) => c.value !== 'X').map((c) => c.index);
      if (notXCellIndices.length === columnHints[0] && isArrayConsecutive(notXCellIndices)) {
        for (let i = 0; i < notXCellIndices.length; i++) {
          columnAsArray[notXCellIndices[i]] = 'O';
        }
      }
    }
  }
  const columnHintsSum = columnHints.reduce((accumulator, currentValue, currentIndex) => {
    return accumulator + currentValue + (currentIndex === columnHints.length - 1 ? 0 : 1);
  }, 0);

  if (columnHintsSum === solution.length) {
    let fillIndex = 0;
    for (let columnHintsIndex = 0; columnHintsIndex < columnHints.length; columnHintsIndex++) {
      for (let hintCell = 0; hintCell < columnHints[columnHintsIndex]; hintCell++) {
        columnAsArray[fillIndex] = 'O';
        fillIndex++;
      }
      fillIndex++;
    }
  }
  let unknownCells = false;
  for (let cellIndex = 0; cellIndex < columnAsArray.length; cellIndex++) {
    if (!columnAsArray[cellIndex]) {
      unknownCells = true;
      break;
    }
  }
  if (unknownCells) {
    tryFindDirectIntervalSolutionColumn(columnHints, columnAsArray, columnIndex);
  }
  columnToSolution(columnAsArray, columnIndex, solution);
}

function tryFindDirectIntervalSolutionColumn(columnHints, columnAsArray) {
  // find solutions in intervals
  const columnLength = columnAsArray.length;
  const xIntervalStartIndices = [-1];
  if (columnAsArray[0] !== 'X') { // ugly but maybe works?
    xIntervalStartIndices.push(-1);
  }
  columnAsArray.forEach((cell, cellIndex) => {
    if (cell === 'X') {
      xIntervalStartIndices.push(cellIndex);
    }
  });
  xIntervalStartIndices.push(columnLength); // pretend we have qan X at the start and end of the row
  xIntervalStartIndices.splice(0, 1);

  const lengthsOfIntervalsBetweenXs = xIntervalStartIndices.map((startOfIntervalIndex, index) => {
    if (index === 0) {
      return xIntervalStartIndices[index + 1];
    }
    return startOfIntervalIndex - 1 - xIntervalStartIndices[index - 1];
  }).filter(interval => interval !== 0);
  lengthsOfIntervalsBetweenXs.splice(0, 1);

  if (columnHints.length === lengthsOfIntervalsBetweenXs.length) {
    columnHints.forEach((columnHint, columnHintIndex) => {
      if (isEqual(columnHint, lengthsOfIntervalsBetweenXs[columnHintIndex])) {
        for (let cellToFillIndexOffsetFromStartOfInterval = 0; cellToFillIndexOffsetFromStartOfInterval < columnHint; cellToFillIndexOffsetFromStartOfInterval++) {
          columnAsArray[xIntervalStartIndices[columnHintIndex] + cellToFillIndexOffsetFromStartOfInterval + 1] = 'O';
        }
      }
    });
  }
}

function tryFindSequentialSolutionForColumn(columnHints, solution, columnIndex) {
  const columnAsArray = solution.map((row) => row[columnIndex]);

  // try solve simple case: eg rowHint [3] and solution row [X, undefined, O, undefined, X] then we can fill in like so [X, O, O, O, X]
  // first find the indices
  const knownXAndUnknownIndicesForColumn = columnAsArray.reduce((accumulator, currentValue, currentIndex) => {
    if (currentValue !== 'X') {
      accumulator.push(currentIndex);
    }
    return accumulator;
  }, []);
  if (columnHints.length === 0) {
    // if the indices are consecutive, then we know we have a unique solution
    if (columnHints[0] === knownXAndUnknownIndicesForColumn.length && isArrayConsecutive(knownXAndUnknownIndicesForColumn)) {
      // so we can replace all cells with those indices with O
      for (let i = 0; i < knownXAndUnknownIndicesForColumn.length; i++) {
        columnAsArray[knownXAndUnknownIndicesForColumn[i]] = 'O';
      }
    }
  }
  // if we know there is an O one side, we can fill in some more known Os from the first hint
  if (columnAsArray[0] === 'O') {
    let cellIndex = 0;
    for (; cellIndex < columnHints[0]; cellIndex++) {
      columnAsArray[cellIndex] = 'O';
    }
    if (cellIndex !== columnAsArray.length) {
      columnAsArray[cellIndex] = 'X';
    }
  }

  const lastCellIndex = columnAsArray.length - 1;
  if (columnAsArray[lastCellIndex] === 'O') {
    const cellsToFill = columnHints[columnHints.length - 1];
    let cellIndex = lastCellIndex;
    for (; cellIndex > lastCellIndex - cellsToFill; cellIndex--) {
      columnAsArray[cellIndex] = 'O';
    }
    if (cellIndex >= 0) {
      columnAsArray[cellIndex] = 'X';
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

function fillPossibleOFromMiddlePlusOneToUpColumn(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, columnAsArray) {
  let cellIndex = foundFirstOCellIndex + 1;

  for (let cellsFilledWithPossibleO = 0;
    numberOfPossibleOToFillInOneDirection > 0 && cellsFilledWithPossibleO !== numberOfPossibleOToFillInOneDirection && cellIndex < columnAsArray.length;
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
}


function fillPossibleOFromMiddleMinusOneToDownColumn(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, columnAsArray) {
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
}

function fillImpossibleMovesForRow(rowHints, solution, rowIndex) {
  const numberOfKnownOsInRow = solution[rowIndex].filter((cell) => cell === 'O').length;
  if (numberOfKnownOsInRow === sum(rowHints)) {
    solution[rowIndex].forEach((cell, cellIndex) => {
      if (!cell) {
        solution[rowIndex][cellIndex] = 'X';
      }
    });
  }

  if (rowHints.length === 1) {
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

function fillImpossibleMovesForColumn(columnHints, solution, columnIndex) {
  let columnAsArray = solution.map((row) => row[columnIndex]);
  const numberOfKnownOsInRow = columnAsArray.filter((cell) => cell === 'O').length;
  if (numberOfKnownOsInRow === sum(columnHints)) {
    columnAsArray.forEach((cell, cellIndex) => {
      if (!cell) {
        columnAsArray[cellIndex] = 'X';
      }
    });
  }

  if (columnHints.length === 1) {
    const foundFirstOCellIndex = columnAsArray.findIndex((cell) => cell === 'O');

    if (foundFirstOCellIndex !== -1) {
      const numberOfPossibleOToFillInOneDirection = columnHints[0] - 1;
      fillPossibleOFromMiddlePlusOneToUpColumn(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, columnAsArray, columnIndex);
      fillPossibleOFromMiddleMinusOneToDownColumn(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, columnAsArray, columnIndex);

      columnAsArray.forEach((cell, cellIndex) => {
        if (cell === 'Possible O') {
          columnAsArray[cellIndex] = undefined;
        }
      });
    }
  }
  columnToSolution(columnAsArray, columnIndex, solution);
}

function getLongestNonXSequence(row) {
  let longestSequenceStartIndex = 0;
  let longestSequenceLength = 0;
  let currentSequenceStartIndex = 0;
  let currentSequenceLength = 0;

  for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
    if (cellIndex > 0 && row[cellIndex - 1] === 'X') {
      currentSequenceLength = 0;
      currentSequenceStartIndex = cellIndex;
    }

    if (row[cellIndex] !== 'X') {
      currentSequenceLength++;

      if (currentSequenceLength > longestSequenceLength) {
        longestSequenceLength = currentSequenceLength;
        longestSequenceStartIndex = currentSequenceStartIndex;
      }
    }
  }
  return {
    index: longestSequenceStartIndex,
    length: longestSequenceLength
  }
}

function tryFindPartialSolutionForRow(rowHints, solution, rowIndex) {
  if (rowHints.length === 1) {
    const longestNonXSequence = getLongestNonXSequence(solution[rowIndex]);
    if (rowHints[0] > (longestNonXSequence.length / 2)) {
      const fillFromIndex = longestNonXSequence.index + parseInt(longestNonXSequence.length / 2);
      solution[rowIndex][fillFromIndex] = 'O';

      const numberOfCellsToFillInEachDirection = parseInt((rowHints[0] - 2) / 2);

      let cellsFilledTotal = 0;

      for (let cellIndex = fillFromIndex + 1, cellsFilled = 0; cellsFilled < numberOfCellsToFillInEachDirection && cellIndex < solution[rowIndex].length; cellIndex++ , cellsFilled++) {
        solution[rowIndex][cellIndex] = 'O';
        cellsFilledTotal++;
      }
      for (let cellIndex = fillFromIndex - 1, cellsFilled = 0; cellsFilled < numberOfCellsToFillInEachDirection && cellIndex >= 0; cellIndex-- , cellsFilled++) {
        solution[rowIndex][cellIndex] = 'O';
        cellsFilledTotal++;
      }
    }
  }
}

function tryFindPartialSolutionForColumn(columnHints, solution, columnIndex) {
  const columnAsArray = solution.map((row) => row[columnIndex]);
  if (columnHints.length === 1) {
    const longestNonXSequence = getLongestNonXSequence(columnAsArray);
    if (columnHints[0] > (longestNonXSequence.length / 2)) {
      const fillFromIndex = longestNonXSequence.index + parseInt(longestNonXSequence.length / 2);
      columnAsArray[fillFromIndex] = 'O';

      const numberOfCellsToFillInEachDirection = parseInt((columnHints[0] - 2) / 2);

      let cellsFilledTotal = 0;

      for (let cellIndex = fillFromIndex + 1, cellsFilled = 0; cellsFilled < numberOfCellsToFillInEachDirection && cellIndex < solution[columnIndex].length; cellIndex++ , cellsFilled++) {
        columnAsArray[cellIndex] = 'O';
        cellsFilledTotal++;
      }
      for (let cellIndex = fillFromIndex - 1, cellsFilled = 0; cellsFilled < numberOfCellsToFillInEachDirection && cellIndex >= 0; cellIndex-- , cellsFilled++) {
        columnAsArray[cellIndex] = 'O';
        cellsFilledTotal++;
      }
    }
  }
  columnToSolution(columnAsArray, columnIndex, solution);
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

  while (true) {
    const solutionAtStartOfPass = cloneDeep(solution);
    rowHints.forEach((row, index) => tryFindDirectSolutionForRow(row, solution, index));
    if (DEBUG === 2) {
      console.log("After direct solutions row\n", solution);
    }
    columnHints.forEach((column, index) => tryFindDirectSolutionForColumn(column, solution, index));
    if (DEBUG) {
      console.log("After direct solutions\n", solution);
    }

    rowHints.forEach((row, index) => fillImpossibleMovesForRow(row, solution, index));
    if (DEBUG === 2) {
      console.log("After filled in impossible moves row\n", solution);
    }
    columnHints.forEach((column, index) => fillImpossibleMovesForColumn(column, solution, index));
    if (DEBUG) {
      console.log("After filled in impossible moves\n", solution);
    }

    rowHints.forEach((row, index) => tryFindSequentialSolutionForRow(row, solution, index));
    if (DEBUG === 2) {
      console.log("After sequentials solutions row\n", solution);
    }
    columnHints.forEach((column, index) => tryFindSequentialSolutionForColumn(column, solution, index));
    if (DEBUG) {
      console.log("After sequential solutions\n", solution);
    }

    rowHints.forEach((row, index) => tryFindPartialSolutionForRow(row, solution, index));
    if (DEBUG === 2) {
      console.log("After partial solutions row\n", solution);
    }

    columnHints.forEach((column, index) => tryFindPartialSolutionForColumn(column, solution, index));
    if (DEBUG) {
      console.log("After partial solutions\n", solution);
    }

    // if no changes have been made, we break and return partial solution
    if (isEqual(solution, solutionAtStartOfPass)) {
      break;
    }

    if (isValidSolution(level, solution)) {
      return fillInMissingCells(solution, 'X');
    }
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
