import rewire from 'rewire';
import solve from '../index';
/* eslint-disable-next-line */
import should from 'should';
import LEVELS from './levels';

const app = rewire('../index');

const getColumn = app.__get__('getColumn');
const columnToSolution = app.__get__('columnToSolution');
const isValidSolution = app.__get__('isValidSolution');
const fillInMissingCells = app.__get__('fillInMissingCells');
const fillImpossibleMovesForRowOrColumn = app.__get__('fillImpossibleMovesForRowOrColumn');
const tryFindPartialSolutionForRowOrColumn = app.__get__('tryFindPartialSolutionForRowOrColumn');
const tryFindSequentialSolutionForRowOrColumn = app.__get__('tryFindSequentialSolutionForRowOrColumn');
const tryFindDirectSolutionForRowOrColumn = app.__get__('tryFindDirectSolutionForRowOrColumn');

describe('try find direct solution for row', () => {
  it('Test case 1', () => {
    const input = ['X', undefined, undefined, undefined, 'X'];
    const expectedResult = ['X', 'O', 'O', 'O', 'X'];
    const rowHint = [3];
    const actualResult = tryFindDirectSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 2', () => {
    const input = ['X', undefined, 'O', 'O', 'X'];
    const expectedResult = ['X', 'O', 'O', 'O', 'X'];
    const rowHint = [3];
    const actualResult = tryFindDirectSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 3', () => {
    const input = ['X', undefined, 'O', 'O', 'X', 'O', 'O', 'O', 'O', 'O'];
    const expectedResult = ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'O', 'O'];
    const rowHint = [3, 5];
    const actualResult = tryFindDirectSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 4', () => {
    const input = ['O', 'O', 'X', undefined, undefined, 'X', 'O', undefined, 'X', 'O'];
    const expectedResult = ['O', 'O', 'X', 'O', 'O', 'X', 'O', undefined, 'X', 'O'];
    const rowHint = [2, 2, 1, 1];
    const actualResult = tryFindDirectSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 5', () => {
    const input = ['O', 'O', 'X', 'X', undefined, undefined, 'X', 'X', 'O', 'O'];
    const expectedResult = ['O', 'O', 'X', 'X', 'O', 'O', 'X', 'X', 'O', 'O'];
    const rowHint = [2, 2, 2];
    const actualResult = tryFindDirectSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  /*
  it.only('Test case 6', () => {
    const input = [undefined, undefined, 'O', 'O', undefined, 'O', undefined];
    const expectedResult = ['X', 'X', 'O', 'O', 'X', 'O', 'X'];
    const rowHint = [2, 2];
    const actualResult = tryFindDirectSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  }); */

  it('Test case 1 column', () => {
    const solutionSoFar = [
      ['X'],
      [undefined],
      [undefined],
      [undefined],
      ['X']
    ];

    const columnHint = [3];
    const columnIndex = 0;
    const column = getColumn(solutionSoFar, columnIndex);
    const expectedResult = [
      ['X'],
      ['O'],
      ['O'],
      ['O'],
      ['X']
    ];

    const columnSolution = tryFindDirectSolutionForRowOrColumn(columnHint, column);
    columnToSolution(columnSolution, columnIndex, solutionSoFar);
    should.deepEqual(expectedResult, solutionSoFar);
  });

  it('Test case 2 column', () => {
    const solutionSoFar = [
      ['O'],
      ['O'],
      ['X'],
      [undefined],
      [undefined],
      ['X'],
      ['O'],
      [undefined],
      ['X'],
      ['O']
    ];

    const columnHint = [2, 2, 1, 1];
    const columnIndex = 0;
    const column = getColumn(solutionSoFar, columnIndex);
    const expectedResult = [
      ['O'],
      ['O'],
      ['X'],
      ['O'],
      ['O'],
      ['X'],
      ['O'],
      [undefined],
      ['X'],
      ['O']
    ];
    const columnSolution = tryFindDirectSolutionForRowOrColumn(columnHint, column);
    columnToSolution(columnSolution, columnIndex, solutionSoFar);
    should.deepEqual(expectedResult, solutionSoFar);
  });
});

describe('Try find sequential solution for row or column', () => {
  it('test case 1', () => {
    const input = ['O', undefined, undefined, undefined, undefined];
    const expectedResult = ['O', 'O', 'X', undefined, undefined];
    const rowHint = [2, 1];
    const actualResult = tryFindSequentialSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('test case 2', () => {
    const input = [undefined, undefined, undefined, undefined, 'O'];
    const expectedResult = [undefined, undefined, 'X', 'O', 'O'];
    const rowHint = [1, 2];
    const actualResult = tryFindSequentialSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('test case 1 column', () => {
    const solutionSoFar = [
      ['O'],
      [undefined],
      [undefined],
      [undefined],
      [undefined]
    ];

    const columnHint = [2, 1];
    const columnIndex = 0;
    const column = getColumn(solutionSoFar, columnIndex);
    const expectedResult = [
      ['O'],
      ['O'],
      ['X'],
      [undefined],
      [undefined],
    ];
    const columnSolution = tryFindSequentialSolutionForRowOrColumn(columnHint, column);
    columnToSolution(columnSolution, columnIndex, solutionSoFar);
    should.deepEqual(expectedResult, solutionSoFar);
  });

  it('test case 2 column', () => {
    const solutionSoFar = [
      [undefined],
      [undefined],
      [undefined],
      [undefined],
      ['O']
    ];

    const columnHint = [1, 2];
    const columnIndex = 0;
    const column = getColumn(solutionSoFar, columnIndex);
    const expectedResult = [
      [undefined],
      [undefined],
      ['X'],
      ['O'],
      ['O']
    ];
    const columnSolution = tryFindSequentialSolutionForRowOrColumn(columnHint, column);
    columnToSolution(columnSolution, columnIndex, solutionSoFar);
    should.deepEqual(expectedResult, solutionSoFar);
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

  it('Test case with multiple possible solutions', () => {
    const level = {
      columnHints: [
        [1],
        [1]
      ],
      rowHints: [
        [1],
        [1]
      ]
    };
    const solution1 = [
      ['O', 'X'],
      ['X', 'O']
    ];
    isValidSolution(level, solution1).should.be.true();

    const solution2 = [
      ['X', 'O'],
      ['O', 'X']
    ];
    isValidSolution(level, solution2).should.be.true();
  });
});

describe('Fill in impossible moves for row or column', () => {
  it('Test case 1', () => {
    const input = [undefined, undefined, undefined, 'O', undefined];
    const expectedResult = ['X', undefined, undefined, 'O', undefined];
    const rowHint = [3];
    const actualResult = fillImpossibleMovesForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 2', () => {
    const input = [undefined, undefined, undefined, undefined, 'O'];
    const expectedResult = ['X', 'X', undefined, undefined, 'O'];
    const rowHint = [3];
    const actualResult = fillImpossibleMovesForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 3', () => {
    const input = ['O', undefined, undefined, undefined, undefined];
    const expectedResult = ['O', undefined, undefined, 'X', 'X'];
    const rowHint = [3];
    const actualResult = fillImpossibleMovesForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 4', () => {
    const input = [undefined, undefined, 'O', undefined, undefined];
    const expectedResult = ['X', undefined, 'O', undefined, 'X'];
    const rowHint = [2];
    const actualResult = fillImpossibleMovesForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 5', () => {
    const input = ['O', 'O', 'X', 'O', undefined];
    const expectedResult = ['O', 'O', 'X', 'O', 'X'];
    const rowHint = [2, 1];
    const actualResult = fillImpossibleMovesForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it.skip('Test case 6', () => {
    const input = [undefined, undefined, 'O', 'O', undefined, 'O', undefined];
    const expectedResult = ['X', 'X', 'O', 'O', 'X', 'O', undefined];
    const rowHint = [2, 2];
    const actualResult = fillImpossibleMovesForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });
});

describe('Try find partial solutions for row or column', () => {
  it('Test case 1', () => {
    const input = [undefined, undefined, undefined, undefined, undefined];
    const expectedResult = [undefined, undefined, 'O', undefined, undefined];
    const rowHint = [3];
    const actualResult = tryFindPartialSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });

  it('Test case 2', () => {
    const input = [undefined, undefined, undefined, undefined, undefined];
    const expectedResult = [undefined, 'O', 'O', 'O', undefined];
    const rowHint = [4];
    const actualResult = tryFindPartialSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
  });
  it.skip('Test case 3', () => {
    const input = [undefined, undefined, undefined, undefined, undefined];
    const expectedResult = ['O', 'O', 'O', 'O', 'O'];
    const rowHint = [5];
    const actualResult = tryFindPartialSolutionForRowOrColumn(rowHint, input);
    should.deepEqual(expectedResult, actualResult);
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

  it('Should solve First steps 14', () => {
    const expectedSolution = [
      ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
      ['O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'X'],
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS[13]);
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve First steps 15', () => {
    const expectedSolution = [
      ['X', 'X', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
      ['X', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'X', 'X', 'X', 'X', 'O', 'O', 'O'],
      ['O', 'O', 'X', 'O', 'X', 'X', 'O', 'X', 'O', 'O'],
      ['O', 'X', 'X', 'O', 'X', 'X', 'O', 'X', 'X', 'O'],
      ['O', 'O', 'X', 'X', 'X', 'X', 'X', 'X', 'O', 'O'],
      ['O', 'O', 'X', 'O', 'O', 'O', 'O', 'X', 'O', 'O'],
      ['O', 'O', 'X', 'X', 'O', 'O', 'X', 'X', 'O', 'O'],
      ['O', 'O', 'O', 'X', 'X', 'X', 'X', 'O', 'O', 'O'],
      ['O', 'O', 'O', 'O', 'O', 'X', 'O', 'O', 'O', 'O'],
    ];
    const actualSolution = solve(LEVELS.FIRST_STEPS.find((level => level.name === '15')));
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve Easy 8', () => {
    const expectedSolution = [
      [ 'X', 'O', 'X', 'X', 'X', 'O' ],
      [ 'X', 'X', 'O', 'O', 'O', 'X' ],
      [ 'O', 'O', 'X', 'X', 'X', 'O' ],
      [ 'O', 'O', 'X', 'X', 'X', 'O' ],
      [ 'X', 'X', 'O', 'O', 'O', 'X' ],
      [ 'X', 'O', 'X', 'X', 'X', 'O' ]
    ];
    const actualSolution = solve(LEVELS.EASY.find((level => level.name === '8')));
    should.deepEqual(expectedSolution, actualSolution);
  });

  it('Should solve Easy 14', () => {
    const expectedSolution = [
      [ 'X', 'O', 'X', 'X', 'X', 'X', 'X' ],
      [ 'X', 'O', 'X', 'X', 'X', 'X', 'X' ],
      [ 'O', 'X', 'O', 'X', 'O', 'O', 'O' ],
      [ 'O', 'X', 'O', 'X', 'O', 'X', 'O' ],
      [ 'O', 'X', 'O', 'X', 'O', 'X', 'O' ],
      [ 'O', 'X', 'O', 'X', 'X', 'O', 'X' ],
      [ 'O', 'O', 'O', 'X', 'O', 'O', 'O' ]
    ];
    const actualSolution = solve(LEVELS.EASY.find((level => level.name === '14')));
    should.deepEqual(expectedSolution, actualSolution);
  });

  it.skip('Should solve Easy 20', () => {
    const expectedSolution = [
      [ 'X', 'O', 'X', 'O', 'O', 'X', 'X' ],
      [ 'X', 'O', 'O', 'O', 'O', 'O', 'X' ],
      [ 'O', 'X', 'X', '?', 'X', 'X', 'O' ],
      [ 'O', 'O', 'O', 'O', 'O', 'O', 'O' ],
      [ 'X', 'O', 'X', 'X', 'X', 'O', 'X' ],
      [ 'O', 'X', 'X', 'X', 'O', 'X', 'X' ],
      [ 'O', 'O', 'O', 'O', 'X', 'X', 'X' ]
    ];
    const actualSolution = solve(LEVELS.EASY.find((level => level.name === '20')));
    should.deepEqual(expectedSolution, actualSolution);
  });

  it.skip('Should solve Easy 40', () => {
    const expectedSolution = [
    ];
    const actualSolution = solve(LEVELS.EASY.find((level => level.name === '40')));
    should.deepEqual(expectedSolution, actualSolution);
  });


  it.skip('Should solve daily puzzle for June 25, 2018', () => {
    const expectedSolution = [
    ];
    const actualSolution = solve(LEVELS.DAILY_LEVELS[0]);
    should.deepEqual(expectedSolution, actualSolution);
  });
})
