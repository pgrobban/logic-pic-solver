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
  })
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
    const columnValues = [3];
    const columnIndex = 0;
    fillImpossibleMovesForColumn(columnValues, solution, columnIndex);
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
    const columnValues = [3];
    const columnIndex = 0;
    fillImpossibleMovesForColumn(columnValues, solution, columnIndex);
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
    const columnValues = [3];
    const columnIndex = 0;
    fillImpossibleMovesForColumn(columnValues, solution, columnIndex);
    should.deepEqual(solution, expectedResult);
  });
})

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
})
