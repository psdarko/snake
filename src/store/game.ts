import createCustomReducer, { ActionWithPayload } from './utils/createCustomReducer';
export enum GameStatus {
  INITIAL = 'INITIAL',
  ACTIVE = 'ACTIVE',
  PAUSE = 'PAUSE',
  END = 'END',
}

export interface Point {
  x: number
  y: number
}

export enum Direction {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP = 'UP',
  DOWN = 'DOWN',
}

export interface Snake {
  nextDirection: Direction
  currentDirection: Direction
  points: Point[]
}

export interface GameState {
  width: number
  height: number
  speed: number
  hasWalls: boolean
  status: GameStatus

  apple: Point
  appleCount: number
  snake: Snake
}

const initialSnakeLength = 4;
const initialWidth = 40;
const initialHeight = 20;

const initialState: GameState = {
  width: initialWidth,
  height: initialHeight,
  speed: 20,
  hasWalls: true,
  status: GameStatus.INITIAL,
  apple: generateApple(initialWidth, initialHeight),
  appleCount: 0,
  snake: {
    nextDirection: Direction.RIGHT,
    currentDirection: Direction.RIGHT,
    points: generateSnakePoints(initialWidth, initialHeight, initialSnakeLength),
  }
};

const PREFIX = 'game';

const TYPES = {
  CHANGE_SIZE: `${PREFIX}/CHANGE_SIZE`,
  CHANGE_SPEED: `${PREFIX}/CHANGE_SPEED`,
  TOGGLE_WALLS: `${PREFIX}/TOGGLE_WALLS`,
  CHANGE_STATUS: `${PREFIX}/CHANGE_STATUS`,
  MOVE_SNAKE: `${PREFIX}/MOVE_SNAKE`,
  CHANGE_DIRECTION: `${PREFIX}/CHANGE_DIRECTION`,
};

interface ChangeSizeAction extends ActionWithPayload {
  type: typeof TYPES.CHANGE_SIZE
  payload: { width: number, height: number }
}

interface ChangeSpeedAction extends ActionWithPayload {
  type: typeof TYPES.CHANGE_SPEED
  payload: number
}

interface ToggleWallsAction extends ActionWithPayload {
  type: typeof TYPES.TOGGLE_WALLS
}

interface ChangeStatusAction extends ActionWithPayload {
  type: typeof TYPES.CHANGE_SPEED
  payload: GameStatus
}

interface MoveSnakeAction extends ActionWithPayload {
  type: typeof TYPES.MOVE_SNAKE
}

interface ChangeDirectionAction extends ActionWithPayload {
  type: typeof TYPES.CHANGE_DIRECTION
  payload: Direction
}

type GameActions = ChangeSizeAction | ChangeSpeedAction | ToggleWallsAction
  | ChangeStatusAction | MoveSnakeAction | ChangeDirectionAction;

export const actions = {
  actionChangeSize(size: ChangeSizeAction['payload']): ChangeSizeAction {
    return {
      type: TYPES.CHANGE_SIZE,
      payload: size,
    }
  },
  actionChangeSpeed(speed: ChangeSpeedAction['payload']): ChangeSpeedAction {
    return {
      type: TYPES.CHANGE_SPEED,
      payload: speed,
    }
  },
  actionToggleWalls(): ToggleWallsAction {
    return {
      type: TYPES.TOGGLE_WALLS
    };
  },
  actionChangeStatus(status: ChangeStatusAction['payload']): ChangeStatusAction {
    return {
      type: TYPES.CHANGE_STATUS,
      payload: status,
    }
  },
  actionMoveSnake() {
    return {
      type: TYPES.MOVE_SNAKE,
    }
  },
  actionChangeDirection(direction: ChangeDirectionAction['payload']) {
    return {
      type: TYPES.CHANGE_DIRECTION,
      payload: direction,
    }
  },
};

export default createCustomReducer<GameState, GameActions>(initialState, {
  [TYPES.CHANGE_SIZE]:
    (state, action, size) => ({
      ...state,
      ...size,
      apple: generateApple(size.width, size.height),
      snake: {
        ...state.snake,
        points: generateSnakePoints(size.width, size.height, initialSnakeLength),
      },
    }),

  [TYPES.CHANGE_SPEED]:
    (state, action, speed) => ({
      ...state,
      speed,
    }),

  [TYPES.TOGGLE_WALLS]:
    (state) => ({
      ...state,
      hasWalls: !state.hasWalls,
    }),

  [TYPES.CHANGE_STATUS]:
    (state, action, status) => {
      if (state.status === GameStatus.END) {
        return {
          ...state,
          status,
          appleCount: 0,
          apple: generateApple(state.width, state.height),
          snake: {
            ...state.snake,
            currentDirection: Direction.RIGHT,
            nextDirection: Direction.RIGHT,
            points: generateSnakePoints(state.width, state.height, initialSnakeLength),
          }
        }
      }
      return {
        ...state,
        status,
      }
    },

  [TYPES.CHANGE_DIRECTION]:
    (state, action, direction) => ({
      ...state,
      snake: {
        ...state.snake,
        nextDirection: direction,
      },
    }),

  [TYPES.MOVE_SNAKE]:
    (state) => {
      const {
        width, height,
        hasWalls,
        apple: currentApple,
        snake: {
          nextDirection: direction,
          points,
        },
      } = state;
      let appleCount = state.appleCount;
      const nextPoint = getNextPoint(points[points.length - 1], direction);
      if (
        (hasWalls && (nextPoint.x < 1 || nextPoint.x > width || nextPoint.y < 1 || nextPoint.y > height))
        || isExistPoint(nextPoint, points)
      ) {
        return {
          ...state,
          status: GameStatus.END,
        }
      } else if (!hasWalls) {
        if (nextPoint.x < 1) {
          nextPoint.x = width;
        } else if (nextPoint.x > width) {
          nextPoint.x = 1;
        } else if (nextPoint.y < 1) {
          nextPoint.y = height;
        } else if (nextPoint.y > height) {
          nextPoint.y = 1;
        }
      }

      let apple = currentApple;
      let newPoints = points;
      // eat apple
      if (nextPoint.x === apple.x && nextPoint.y === apple.y) {
        newPoints = [...points, nextPoint];
        apple = generateApple(width, height);
        appleCount++;
      } else {
        newPoints = points.slice(1);
        newPoints.push(nextPoint);
      }

      return {
        ...state,
        apple,
        appleCount,
        snake: {
          ...state.snake,
          points: newPoints,
          currentDirection: direction,
        }
      }
    }
});

// ======================================================
// Helpers
// ======================================================
function getNextPoint(currentPoint: Point, direction: Direction): Point {
  switch(direction) {
    case Direction.RIGHT:
      return {
        x: currentPoint.x + 1,
        y: currentPoint.y,
      };
    case Direction.LEFT:
      return {
        x: currentPoint.x - 1,
        y: currentPoint.y,
      };
    case Direction.UP:
      return {
        x: currentPoint.x,
        y: currentPoint.y - 1,
      };
    case Direction.DOWN:
      return {
        x: currentPoint.x,
        y: currentPoint.y + 1,
      };
  }
}

function generateApple(width: number, height: number): Point {
  return {
    x: Math.round(Math.random() * (width - 1)) + 1,
    y: Math.round(Math.random() * (height - 1)) + 1,
  }
}

function generateSnakePoints(width: number, height: number, snakeLength: number): Point[] {
  return new Array(snakeLength).fill(0).map((_, i) => ({
    x: Math.floor(width / 2) - Math.floor(snakeLength / 2) + i,
    y: Math.floor(height / 2),
  }));
}

function isExistPoint(point: Point, points: Point[]) {
  return points.some(p => p.x === point.x && p.y === point.y);
}