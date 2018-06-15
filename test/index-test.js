import rewire from 'rewire';
import solve from '../index';
/* eslint-disable-next-line */
import should from 'should';
import LEVELS from './levels';

const app = rewire('../index');

const isValidSolution = app.__get__('isValidSolution');
const fillInMissingCellsWithX = app.__get__('fillInMissingCellsWithX');
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
    const actualResult = fillInMissingCellsWithX(input);
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
    const rowValues = [3];
    const rowIndex = 0;
    fillImpossibleMovesForRow(rowValues, solution, rowIndex);
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
    const rowValues = [3];
    const rowIndex = 0;
    fillImpossibleMovesForRow(rowValues, solution, rowIndex);
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
    const rowValues = [3];
    const rowIndex = 0;
    fillImpossibleMovesForRow(rowValues, solution, rowIndex);
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

  it.skip('Should solve First steps 2', () => {
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


  it.skip('Should solve First steps 3', () => {
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
})
