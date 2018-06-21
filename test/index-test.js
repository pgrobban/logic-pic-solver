import rewire from 'rewire';
import solve from '../index';
/* eslint-disable-next-line */
import should from 'should';
import LEVELS from './levels';

const app = rewire('../index');

const isValidSolution = app.__get__('isValidSolution');
const fillInMissingCells = app.__get__('fillInMissingCells');
const fillImpossibleMovesForRow = app.__get__('fillImpossibleMovesForRow');
const fillImpossibleMovesForColumn = app.__get__('fillImpossibleMovesForColumn');
const tryFindPartialSolutionForRow = app.__get__('tryFindPartialSolutionForRow');
const tryFindSequentialSolutionForRow = app.__get__('tryFindSequentialSolutionForRow');
const tryFindSequentialSolutionForColumn = app.__get__('tryFindSequentialSolutionForColumn');
const tryFindDirectSolutionForRow = app.__get__('tryFindDirectSolutionForRow');
const tryFindDirectSolutionForColumn = app.__get__('tryFindDirectSolutionForColumn');


describe('try find direct solution for row', () => {
  it('Test case 1', () => {
    const input = [
      ['X', undefined, undefined, undefined, 'X']
    ];
    const expectedResult = [
      ['X', 'O', 'O', 'O', 'X']
    ];
    const rowHint = [3];
    const rowIndex = 0;
    tryFindDirectSolutionForRow(rowHint, input, rowIndex);
    should.deepEqual(expectedResult, input);
  });
});

describe('try find direct solution for column', () => {
  it('Test case 1', () => {
    const input = [
      ['X'],
      [undefined],
      [undefined],
      [undefined],
      ['X']
    ];
    const expectedResult = [
      ['X'],
      ['O'],
      ['O'],
      ['O'],
      ['X']
    ];
    const columnHint = [3];
    const columnIndex = 0;
    tryFindDirectSolutionForColumn(columnHint, input, columnIndex);
    should.deepEqual(expectedResult, input);
  });
});

describe('Try find sequential solution for row', () => {
  it('test case 1', () => {
    const input = [
      ['O', undefined, undefined, undefined, undefined]
    ];
    const expectedResult = [
      ['O', 'O', 'X', undefined, undefined]
    ];
    const rowHint = [2, 1];
    const rowIndex = 0;
    tryFindSequentialSolutionForRow(rowHint, input, rowIndex);
    should.deepEqual(expectedResult, input);
  });

  it('test case 2', () => {
    const input = [
      [undefined, undefined, undefined, undefined, 'O']
    ];
    const expectedResult = [
      [undefined, undefined, 'X', 'O', 'O']
    ];
    const rowHint = [1, 2];
    const rowIndex = 0;
    tryFindSequentialSolutionForRow(rowHint, input, rowIndex);
    should.deepEqual(expectedResult, input);
  });
});

describe('Try find sequential solution for column', () => {
  it('test case 1', () => {
    const input = [
      ['O'],
      [undefined],
      [undefined],
      [undefined],
      [undefined]
    ];
    const expectedResult = [
      ['O'],
      ['O'],
      ['X'],
      [undefined],
      [undefined],
    ];
    const columnHint = [2, 1];
    const columnIndex = 0;
    tryFindSequentialSolutionForColumn(columnHint, input, columnIndex);
    should.deepEqual(expectedResult, input);
  });

  it('test case 2', () => {
    const input = [
      [undefined],
      [undefined],
      [undefined],
      [undefined],
      ['O']
    ];
    const expectedResult = [
      [undefined],
      [undefined],
      ['X'],
      ['O'],
      ['O']
    ];
    const columnHint = [1, 2];
    const columnIndex = 0;
    tryFindSequentialSolutionForColumn(columnHint, input, columnIndex);
    should.deepEqual(expectedResult, input);
  });
}),

describe('fillInMissingCellsWithX', () => {
  it('test case 1', () => {
    const input = [
      [, , , 'O', undefined],
      [, , , 'O', undefined],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O']
    ];
    const expectedResult = [
      ['X', 'X', 'X', 'O', 'X'],
      ['X', 'X', 'X', 'O', 'X'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O']
    ];
    const actualResult = fillInMissingCells(input, 'X');
    should.deepEqual(expectedResult, actualResult);
  });
})

describe('Is valid solution', () => {
  it('Test case 1 correct solution', () => {
    const solution = [
      ['X', 'X', 'X', 'O', 'X'],
      ['X', 'X', 'X', 'O', 'X'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O']
    ];
    isValidSolution(LEVELS.FIRST_STEPS[0], solution).should.be.true();
  });

  it('Test case 1 incorrect solution', () => {
    const solution = [
      ['X', 'X', 'X', 'O', 'X'],
      ['O', 'X', 'X', 'O', 'X'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O']
    ];
    isValidSolution(LEVELS.FIRST_STEPS[0], solution).should.be.false();
  });

  it('Test case 1 correct with undefined cells', () => {
    const solution = [
      [undefined, undefined, undefined, 'O', undefined],
      [undefined, undefined, undefined, 'O', undefined],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O']
    ];
    isValidSolution(LEVELS.FIRST_STEPS[0], solution).should.be.true();
  });
});

describe('Fill in impossible moves for row', () => {
  it('Test case 1', () => {
    const solution = [
      [undefined, undefined, undefined, 'O', undefined],
      [],
      [],
      [],
      []
    ];
    const expectedResult = [
      ['X', undefined, undefined, 'O', undefined],
      [],
      [],
      [],
      []
    ];
    const rowHints = [3];
    const rowIndex = 0;
    fillImpossibleMovesForRow(rowHints, solution, rowIndex);
    should.deepEqual(solution, expectedResult);
  });

  it('Test case 2', () => {
    const solution = [
      [undefined, undefined, undefined, undefined, 'O'],
      [],
      [],
      [],
      []
    ];
    const expectedResult = [
      ['X', 'X', undefined, undefined, 'O'],
      [],
      [],
      [],
      []
    ];
    const rowHints = [3];
    const rowIndex = 0;
    fillImpossibleMovesForRow(rowHints, solution, rowIndex);
    should.deepEqual(solution, expectedResult);
  });

  it('Test case 3', () => {
    const solution = [
      ['O', undefined, undefined, undefined, undefined],
      [],
      [],
      [],
      []
    ];
    const expectedResult = [
      ['O', undefined, undefined, 'X', 'X'],
      [],
      [],
      [],
      []
    ];
    const rowHints = [3];
    const rowIndex = 0;
    fillImpossibleMovesForRow(rowHints, solution, rowIndex);
    should.deepEqual(solution, expectedResult);
  });

  it('Test case 4', () => {
    const solution = [
      [undefined, undefined, 'O', undefined, undefined],
      [],
      [],
      [],
      []
    ];
    const expectedResult = [
      ['X', undefined, 'O', undefined, 'X'],
      [],
      [],
      [],
      []
    ];
    const rowHints = [2];
    const rowIndex = 0;
    fillImpossibleMovesForRow(rowHints, solution, rowIndex);
    should.deepEqual(solution, expectedResult);
  });

  it('Test case 5', () => {
    const solution = [
      ['O', 'O', 'X', 'O', undefined],
      [],
      [],
      [],
      []
    ];
    const expectedResult = [
      ['O', 'O', 'X', 'O', 'X'],
      [],
      [],
      [],
      []
    ];
    const rowHints = [2, 1];
    const rowIndex = 0;
    fillImpossibleMovesForRow(rowHints, solution, rowIndex);
    should.deepEqual(solution, expectedResult);
  });
});

describe('Fill in impossible moves for column', () => {
  it('Test case 1', () => {
    const solution = [
      [undefined],
      [undefined],
      [undefined],
      ['O'],
      [undefined]
    ];
    const expectedResult = [
      ['X'],
      [undefined],
      [undefined],
      ['O'],
      [undefined]
    ];
    const columnHints = [3];
    const columnIndex = 0;
    fillImpossibleMovesForColumn(columnHints, solution, columnIndex);
    should.deepEqual(solution, expectedResult);
  });

  it('Test case 2', () => {
    const solution = [
      [undefined],
      [undefined],
      [undefined],
      [undefined],
      ['O']
    ];
    const expectedResult = [
      ['X'],
      ['X'],
      [undefined],
      [undefined],
      ['O']
    ];
    const columnHints = [3];
    const columnIndex = 0;
    fillImpossibleMovesForColumn(columnHints, solution, columnIndex);
    should.deepEqual(solution, expectedResult);
  });

  it('Test case 3', () => {
    const solution = [
      ['O'],
      [undefined],
      [undefined],
      [undefined],
      [undefined]
    ];
    const expectedResult = [
      ['O'],
      [undefined],
      [undefined],
      ['X'],
      ['X']
    ];
    const columnHints = [3];
    const columnIndex = 0;
    fillImpossibleMovesForColumn(columnHints, solution, columnIndex);
    should.deepEqual(solution, expectedResult);
  });
});

describe('Try find partial solutions for row', () => {
  it('Test case 1', () => {
    const solution = [
      [undefined, undefined, undefined, undefined, undefined]
    ];
    const expectedResult = [
      [undefined, undefined, 'O', undefined, undefined]
    ];
    const rowHints = [3];
    const rowIndex = 0;
    tryFindPartialSolutionForRow(rowHints, solution, rowIndex);
    should.deepEqual(solution, expectedResult);
  });
  it('Test case 2', () => {
    const solution = [
      [undefined, undefined, undefined, undefined, undefined]
    ];
    const expectedResult = [
      [undefined, 'O', 'O', 'O', undefined]
    ];
    const rowHints = [4];
    const rowIndex = 0;
    tryFindPartialSolutionForRow(rowHints, solution, rowIndex);
    should.deepEqual(solution, expectedResult);
  });
  /* it('Test case 3', () => {
    const solution = [
      [undefined, undefined, undefined, undefined, undefined]
    ];
    const expectedResult = [
      ['O', 'O', 'O', 'O', 'O']
    ];
    const rowHints = [5];
    const rowIndex = 0;
    tryFindPartialSolutionForRow(rowHints, solution, rowIndex);
    should.deepEqual(solution, expectedResult);
  }); */
});

describe('Solver', () => {
  it('Should solve First steps 1', () => {
    const expectedSolution = [
      ['X', 'X', 'X', 'O', 'X'],
      ['X', 'X', 'X', 'O', 'X'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[0]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 2', () => {
    const expectedSolution = [
      ['X', 'O', 'O', 'O', 'X'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['X', 'X', 'O', 'X', 'X'],
      ['X', 'X', 'O', 'X', 'X']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[1]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 3', () => {
    const expectedSolution = [
      ['X', 'O', 'O', 'X', 'X'],
      ['X', 'O', 'O', 'O', 'X'],
      ['X', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['X', 'O', 'O', 'O', 'X']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[2]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 4', () => {
    const expectedSolution = [
      ['X', 'X', 'O', 'O', 'O'],
      ['X', 'X', 'O', 'O', 'O'],
      ['O', 'O', 'X', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['X', 'O', 'O', 'O', 'O']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[3]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 5', () => {
    const expectedSolution = [
      ['O', 'O', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'X', 'O', 'O']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[4]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 6', () => {
    const expectedSolution = [
      ['X', 'O', 'O', 'O', 'X'],
      ['X', 'O', 'O', 'O', 'X'],
      ['X', 'X', 'O', 'X', 'X'],
      ['O', 'O', 'X', 'O', 'O'],
      ['O', 'O', 'X', 'O', 'O']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[5]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 7', () => {
    const expectedSolution = [
      ['O', 'X', 'O', 'X', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['X', 'O', 'O', 'O', 'X'],
      ['X', 'O', 'O', 'O', 'X'],
      ['X', 'O', 'X', 'O', 'X']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[6]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 8', () => {
    const expectedSolution = [
      ['X', 'X', 'O', 'X', 'X'],
      ['X', 'O', 'O', 'O', 'X'],
      ['X', 'O', 'X', 'O', 'X'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'X', 'O', 'X', 'O']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[7]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 9', () => {
    const expectedSolution = [
      ['O', 'O', 'O', 'X', 'O'],
      ['O', 'O', 'X', 'X', 'X'],
      ['O', 'X', 'O', 'X', 'O'],
      ['X', 'X', 'X', 'O', 'O'],
      ['O', 'X', 'O', 'O', 'O']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[8]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 10', () => {
    const expectedSolution = [
      ['X', 'O', 'O', 'O', 'X'],
      ['O', 'O', 'X', 'O', 'O'],
      ['O', 'X', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'X', 'O'],
      ['X', 'O', 'O', 'O', 'X']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[9]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 11', () => {
    const expectedSolution = [
      ['O', 'O', 'O', 'X', 'O'],
      ['O', 'X', 'O', 'O', 'O'],
      ['O', 'O', 'X', 'O', 'X'],
      ['X', 'O', 'O', 'X', 'O'],
      ['X', 'O', 'O', 'X', 'O']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[10]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 12', () => {
    const expectedSolution = [
      ['X', 'X', 'X', 'O', 'O'],
      ['O', 'O', 'X', 'O', 'X'],
      ['O', 'O', 'O', 'O', 'X'],
      ['O', 'O', 'O', 'X', 'X'],
      ['O', 'X', 'O', 'X', 'X']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[11]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 13', () => {
    const expectedSolution = [
      ['X', 'O', 'O', 'X', 'X'],
      ['O', 'O', 'O', 'X', 'X'],
      ['X', 'O', 'O', 'O', 'X'],
      ['X', 'O', 'O', 'O', 'O'],
      ['X', 'X', 'O', 'X', 'X']
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[12]);
    should.deepEqual(expectedSolution, actualSolution);
  });
})
