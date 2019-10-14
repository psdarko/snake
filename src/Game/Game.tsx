import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gameSelector } from '../store';
import { actions, Direction, GameStatus } from '../store/game';
import { useEventListener, useWindowSize } from '../utils/hooks';
import GameControls from './GameControls';

import './Game.css';


const speedRate = 50;

function useInfinityAnimation(callback: () => void, isActive: boolean, delay: number) {
  const lastTime = useRef<number>(Date.now());
  const active = useRef<boolean>(isActive);
  const d = useRef<number>(delay);

  useEffect(() => {
    active.current = isActive;
    requestAnimationFrame(run);
  }, [isActive]);
  useEffect(() => {
    d.current = delay;
  }, [delay]);

  function run() {
    if (active.current) {
      const now = Date.now();
      if (now - lastTime.current > d.current) {
        lastTime.current = now;
        callback();
      }
      requestAnimationFrame(run);
    }
  }

}
export default function Game() {
  const game = useSelector(gameSelector);
  const dispatch = useDispatch();

  const handlerChangeDirection = useCallback(
    (direction: Direction) => dispatch(actions.actionChangeDirection(direction)),
    [dispatch],
  );
  const handlerChangeStatus = useCallback(
    (status: GameStatus) => dispatch(actions.actionChangeStatus(status)),
    [dispatch],
  );

  const handlerMoveSnake = useCallback(
    () => dispatch(actions.actionMoveSnake()),
    [dispatch],
  );

  const keyboardWatcher = useCallback((event) => {
    const key = (event as KeyboardEvent).code;
    if (game.status === GameStatus.ACTIVE) {
      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        event.preventDefault();
      }
      switch (game.snake.currentDirection) {
        case Direction.RIGHT:
        case Direction.LEFT:
          if (['ArrowDown', 'KeyS'].includes(key)) {
            handlerChangeDirection(Direction.DOWN);
          } else if (['ArrowUp', 'KeyW'].includes(key)) {
            handlerChangeDirection(Direction.UP);
          }
          break;
        case Direction.DOWN:
        case Direction.UP:
          if (['ArrowLeft','KeyA'].includes(key)) {
            handlerChangeDirection(Direction.LEFT);
          } else if (['ArrowRight', 'KeyD'].includes(key)) {
            handlerChangeDirection(Direction.RIGHT);
          }
          break;
      }
    }
    if (key === 'Space') {
      switch (game.status) {
        case GameStatus.INITIAL:
        case GameStatus.PAUSE:
          handlerChangeStatus(GameStatus.ACTIVE);
          break;
        case GameStatus.ACTIVE:
          handlerChangeStatus(GameStatus.PAUSE);
          break;
        case GameStatus.END:
          handlerChangeStatus(GameStatus.INITIAL);
          break;
      }
    }
  }, [game.snake.currentDirection, game.status, handlerChangeDirection, handlerChangeStatus]);
  useEventListener('keydown', keyboardWatcher);

  useInfinityAnimation(handlerMoveSnake, game.status === GameStatus.ACTIVE, speedRate * (100 / game.speed));

  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowSize();
  const gameSpaceRatio = game.width / game.height;
  const windowRatio = windowWidth / windowHeight;
  let width = game.width;
  let height = game.height;
  if (windowRatio > gameSpaceRatio) {
    height = windowHeight - 200;
    width = height * gameSpaceRatio;
  } else {
    width = windowWidth - 100;
    height = width / gameSpaceRatio;
  }
  const cellSize = width / game.width;

  return (
    <div className="Game">
      <div
        className="GameSpace"
        style={{
          width,
          height,
          gridTemplateColumns: `repeat(${game.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${game.height}, ${cellSize}px)`
        }}
      >
        { game.snake.points.map((point, i) => (
          <div
            key={`${point.x}-${point.y}`}
            className={`Snake${game.snake.points.length - 1 === i ? ` head ${game.snake.currentDirection.toLowerCase()}` : ''}`}
            style={{
              gridArea: `${point.y} / ${point.x} / ${point.y + 1} / ${point.x + 1}`,
            }}
          />
        )) }
        <div
          className="Apple"
          style={{
            backgroundColor: 'green',
            borderRadius: '100px',
            gridArea: `${game.apple.y} / ${game.apple.x} / ${game.apple.y + 1} / ${game.apple.x + 1}`
          }}
        />
      </div>
      { game.status === GameStatus.END && (
        <div
          className="GameOver"
          style={{
            width,
            height,
          }}
        >
          <h1>Игра окончена</h1>
          <p>Яблок съедено: {game.appleCount}</p>
        </div>
      )}
      <GameControls />
    </div>
  );
}
