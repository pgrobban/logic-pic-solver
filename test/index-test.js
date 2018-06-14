import rewire from 'rewire';
import solve from '../index';
/* eslint-disable-next-line */
import should from 'should';
import LEVELS from './levels';

const app = rewire('../index');

const isValidSolution = app.__get__('isValidSolution');
const fillInMissingCellsWithX = app.__get__('fillInMissingCellsWithX');

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
})
