import { sum, sumBy, cloneDeep, isEqual } from 'lodash';
const DEBUG = 0;

function getColumn(solution, columnIndex) {
  return solution.map((row) => row[columnIndex]);
}

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

function tryFindDirectSolutionForRowOrColumn(rowOrColumnHints, rowOrColumnSoFar) {
  let possibleSolution = rowOrColumnSoFar;
  // see if we can fill the whole row with X
  if (rowOrColumnHints.length === 1) {
    if (rowOrColumnHints[0] === 0) {
      possibleSolution = possibleSolution.map(col => 'X');
    } else {
      const numberOfOInRow = possibleSolution.filter((cell) => cell === 'O').length;
      if (numberOfOInRow === rowOrColumnHints[0]) {
        const rowFilledUnknownWithX = possibleSolution.map((cell) => cell === 'O' ? 'O' : 'X');
        possibleSolution = rowFilledUnknownWithX;
      }

      // handle case where hint is a number equal to the remaining unknowns in row and unknowns are consecutive, e.g. hint is [3] and row is [X, undefined, undefined, undefined, X]
      const notXCellIndices = possibleSolution.map((value, index) => ({ value, index })).filter((c) => c.value !== 'X').map((c) => c.index);
      if (notXCellIndices.length === rowOrColumnHints[0] && isArrayConsecutive(notXCellIndices)) {
        for (let i = 0; i < notXCellIndices.length; i++) {
          possibleSolution[notXCellIndices[i]] = 'O';
        }
      }
    }
  }
  // handle cases [3, 1] => [O, O, O, X, O]. should also handle cases where hints has length 1 and equal to the column length, i.e. [5] => [O, O, O, O, O]
  const rowHintsSum = rowOrColumnHints.reduce((accumulator, currentValue, currentIndex) => {
    return accumulator + currentValue + (currentIndex === rowOrColumnHints.length - 1 ? 0 : 1);
  }, 0);
  if (rowHintsSum === possibleSolution.length) {
    let fillIndex = 0;
    for (let hintsIndex = 0; hintsIndex < rowOrColumnHints.length; hintsIndex++) {
      for (let hintCell = 0; hintCell < rowOrColumnHints[hintsIndex]; hintCell++) {
        possibleSolution[fillIndex] = 'O';
        fillIndex++;
      }
      if (fillIndex !== possibleSolution.length) {
        possibleSolution[fillIndex] = 'X';
      }
      fillIndex++;
    }
  }

  // see if we have any more unknown cells. can't use .find() for this cus it skips undefined
  let unknownCells = false;
  for (let cellIndex = 0; cellIndex < possibleSolution.length; cellIndex++) {
    if (!possibleSolution[cellIndex]) {
      unknownCells = true;
      break;
    }
  }
  if (unknownCells) {
    return tryFindDirectIntervalSolutionForRowOrColumn(rowOrColumnHints, rowOrColumnSoFar);
  }
  return possibleSolution;
}

function tryFindDirectIntervalSolutionForRowOrColumn(rowOrColumnHints, rowOrColumnSoFar) {
  let possibleSolution = rowOrColumnSoFar;
  // find solutions in intervals
  const rowLength = rowOrColumnSoFar.length;
  const xIntervalStartIndices = [-1];
  if (possibleSolution[0] !== 'X') { // ugly but maybe works?
    xIntervalStartIndices.push(-1);
  }
  possibleSolution.forEach((cell, cellIndex) => {
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

  if (rowOrColumnHints.length === lengthsOfIntervalsBetweenXs.length) {
    let xIntervalIndex = 0;
    for (let hintIndex = 0; hintIndex < rowOrColumnHints.length; hintIndex++) {
      if (xIntervalStartIndices[hintIndex + 1] && (xIntervalStartIndices[hintIndex + 1] - xIntervalStartIndices[hintIndex] === 1)) {
        xIntervalIndex++;
        continue;
      }
      if (isEqual(rowOrColumnHints[hintIndex], lengthsOfIntervalsBetweenXs[hintIndex])) {
        for (let cellToFillIndexOffsetFromStartOfInterval = 0; cellToFillIndexOffsetFromStartOfInterval < rowOrColumnHints[hintIndex]; cellToFillIndexOffsetFromStartOfInterval++) {
          possibleSolution[xIntervalStartIndices[xIntervalIndex] + cellToFillIndexOffsetFromStartOfInterval + 1] = 'O';
        }
      }
      xIntervalIndex++;
    }
  }
  return possibleSolution;
}

function tryFindSequentialSolutionForRowOrColumn(rowOrColumnHints, rowOrColumnSoFar) {
  const possibleSolution = rowOrColumnSoFar;
  // try solve simple case: eg rowHint [3] and solution row [X, undefined, O, undefined, X] then we can fill in like so [X, O, O, O, X]
  // first find the indices
  const knownXAndUnknownIndicesForRow = possibleSolution.reduce((accumulator, currentValue, currentIndex) => {
    if (currentValue !== 'X') {
      accumulator.push(currentIndex);
    }
    return accumulator;
  }, []);
  if (rowOrColumnHints.length === 0) {
    // if the indices are consecutive, then we know we have a unique solution
    if (rowOrColumnHints[0] === knownXAndUnknownIndicesForRow.length && isArrayConsecutive(knownXAndUnknownIndicesForRow)) {
      // so we can replace all cells with those indices with O
      for (let i = 0; i < knownXAndUnknownIndicesForRow.length; i++) {
        possibleSolution[knownXAndUnknownIndicesForRow[i]] = 'O';
      }
    }
  }
  // if we know there is an O one side, we can fill in some more known Os from the first hint
  if (possibleSolution[0] === 'O') {
    let cellIndex = 0;
    for (; cellIndex < rowOrColumnHints[0]; cellIndex++) {
      possibleSolution[cellIndex] = 'O';
    }
    if (cellIndex !== possibleSolution.length) {
      possibleSolution[cellIndex] = 'X';
    }
  }

  const lastCellIndex = possibleSolution.length - 1;
  if (possibleSolution[lastCellIndex] === 'O') {
    const cellsToFill = rowOrColumnHints[rowOrColumnHints.length - 1];
    let cellIndex = lastCellIndex;
    for (; cellIndex > lastCellIndex - cellsToFill; cellIndex--) {
      possibleSolution[cellIndex] = 'O';
    }
    if (cellIndex >= 0) {
      possibleSolution[cellIndex] = 'X';
    }
  }
  return possibleSolution;
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

function fillPossibleOFromMiddlePlusOneToRight(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solutionSoFar) {
  const possibleSolution = solutionSoFar;
  let cellIndex = foundFirstOCellIndex + 1;
  for (let cellsFilledWithPossibleO = 0;
    numberOfPossibleOToFillInOneDirection > 0 && cellsFilledWithPossibleO !== numberOfPossibleOToFillInOneDirection && cellIndex < possibleSolution.length;
    cellIndex++ , cellsFilledWithPossibleO++) {
    if (!possibleSolution[cellIndex]) {
      possibleSolution[cellIndex] = 'Possible O';
    }
  }

  // we know the rest is impossible so fill with X
  while (cellIndex < possibleSolution.length) {
    if (possibleSolution[cellIndex] !== 'O') {
      possibleSolution[cellIndex] = 'X';
    }
    cellIndex++;
  }
  return possibleSolution;
}

function fillPossibleOFromMiddleMinusOneToLeft(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, solutionSoFar) {
  const possibleSolution = solutionSoFar;
  let cellIndex = foundFirstOCellIndex - 1;

  for (let cellsFilledWithPossibleO = 0;
    numberOfPossibleOToFillInOneDirection >= 1 && // since we include middle
    cellIndex >= 0 && cellsFilledWithPossibleO !== numberOfPossibleOToFillInOneDirection && cellIndex < possibleSolution.length;
    cellIndex-- , cellsFilledWithPossibleO++) {
    if (!possibleSolution[cellIndex]) {
      possibleSolution[cellIndex] = 'Possible O';
    }
  }

  // we know the rest is impossible so fill with X
  while (cellIndex >= 0) {
    if (possibleSolution[cellIndex] !== 'O') {
      possibleSolution[cellIndex] = 'X';
    }
    cellIndex--;
  }
  return possibleSolution;
}

function fillImpossibleMovesForRowOrColumn(rowOrColumnHints, rowOrColumnSoFar) {
  let possibleSolution = rowOrColumnSoFar;
  const numberOfKnownOsInRow = rowOrColumnSoFar.filter((cell) => cell === 'O').length;
  if (numberOfKnownOsInRow === sum(rowOrColumnHints)) {
    rowOrColumnSoFar.forEach((cell, cellIndex) => {
      if (!cell) {
        rowOrColumnSoFar[cellIndex] = 'X';
      }
    });
  }

  if (rowOrColumnHints.length === 1) {
    const foundFirstOCellIndex = possibleSolution.findIndex((cell) => cell === 'O');
    if (foundFirstOCellIndex !== -1) {
      const numberOfPossibleOToFillInOneDirection = rowOrColumnHints[0] - 1;
      possibleSolution = fillPossibleOFromMiddlePlusOneToRight(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, possibleSolution);
      possibleSolution = fillPossibleOFromMiddleMinusOneToLeft(foundFirstOCellIndex, numberOfPossibleOToFillInOneDirection, possibleSolution);

      possibleSolution.forEach((cell, cellIndex) => {
        if (cell === 'Possible O') {
          possibleSolution[cellIndex] = undefined;
        }
      });
    }
  }
  return possibleSolution;
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

function tryFindPartialSolutionForRowOrColumn(rowOrColumnHints, solutionSoFar) {
  const possibbleSolution = solutionSoFar;
  if (rowOrColumnHints.length === 1) {
    const longestNonXSequence = getLongestNonXSequence(possibbleSolution);
    if (rowOrColumnHints[0] > (longestNonXSequence.length / 2)) {
      const fillFromIndex = longestNonXSequence.index + parseInt(longestNonXSequence.length / 2);
      possibbleSolution[fillFromIndex] = 'O';

      const numberOfCellsToFillInEachDirection = parseInt((rowOrColumnHints[0] - 2) / 2);
      let cellsFilledTotal = 0;

      for (let cellIndex = fillFromIndex + 1, cellsFilled = 0; cellsFilled < numberOfCellsToFillInEachDirection && cellIndex < possibbleSolution.length; cellIndex++ , cellsFilled++) {
        possibbleSolution[cellIndex] = 'O';
        cellsFilledTotal++;
      }
      for (let cellIndex = fillFromIndex - 1, cellsFilled = 0; cellsFilled < numberOfCellsToFillInEachDirection && cellIndex >= 0; cellIndex-- , cellsFilled++) {
        possibbleSolution[cellIndex] = 'O';
        cellsFilledTotal++;
      }
    }
  }
  return possibbleSolution;
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
    rowHints.forEach((row, rowIndex) => {
      solution[rowIndex] = tryFindDirectSolutionForRowOrColumn(row, solution[rowIndex]);
    });
    if (DEBUG === 2) {
      console.log("After direct solutions row\n", solution);
    }
    columnHints.forEach((columnHint, columnIndex) => {
      const column = getColumn(solution, columnIndex);
      const columnSolution = tryFindDirectSolutionForRowOrColumn(columnHint, column);
      columnToSolution(columnSolution, columnIndex, solution);
    });
    if (DEBUG) {
      console.log("After direct solutions\n", solution);
    }

    rowHints.forEach((row, rowIndex) => {
      solution[rowIndex] = fillImpossibleMovesForRowOrColumn(row, solution[rowIndex]);
    });
    if (DEBUG === 2) {
      console.log("After filled in impossible moves row\n", solution);
    }
    columnHints.forEach((columnHint, columnIndex) => {
      const column = getColumn(solution, columnIndex);
      const columnSolution = fillImpossibleMovesForRowOrColumn(columnHint, column);
      columnToSolution(columnSolution, columnIndex, solution);
    });
    if (DEBUG) {
      console.log("After filled in impossible moves\n", solution);
    }

    rowHints.forEach((row, rowIndex) => {
      solution[rowIndex] = tryFindSequentialSolutionForRowOrColumn(row, solution[rowIndex]);
    });
    if (DEBUG === 2) {
      console.log("After sequentials solutions row\n", solution);
    }
    columnHints.forEach((columnHint, columnIndex) => {
      const column = getColumn(solution, columnIndex);
      const columnSolution = tryFindSequentialSolutionForRowOrColumn(columnHint, column);
      columnToSolution(columnSolution, columnIndex, solution);
    });
    if (DEBUG) {
      console.log("After sequential solutions\n", solution);
    }

    rowHints.forEach((row, rowIndex) => {
      solution[rowIndex] = tryFindPartialSolutionForRowOrColumn(row, solution[rowIndex]);
    });
    if (DEBUG === 2) {
      console.log("After sequentials solutions row\n", solution);
    }
    columnHints.forEach((columnHint, columnIndex) => {
      const column = getColumn(solution, columnIndex);
      const columnSolution = tryFindPartialSolutionForRowOrColumn(columnHint, column);
      columnToSolution(columnSolution, columnIndex, solution);
    });
    if (DEBUG) {
      console.log("After sequential solutions\n", solution);
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
