import rewire from 'rewire';
import solve from '../index';
/* eslint-disable-next-line */
import should from 'should';

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
  it('Test case 1', () => {
    isValidSolution().should.be.true;
  });;
});

describe('Solver', () => {
  it('Should solve First steps 1', () => {
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
    const expectedSolution = [
      ['X', 'X', 'X', 'O', 'X'],
      ['X', 'X', 'X', 'O', 'X'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O']
    ];
    const actualSolution = solve(columns, rows);
    should.deepEqual(expectedSolution, actualSolution);
  });
})
