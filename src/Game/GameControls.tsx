import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useDebounceCallback from '../utils/hooks/useDebounceCallback';
import { actions, GameStatus } from '../store/game';
import { gameSelector } from '../store';
import NumberField from './fields/NumberField';

import './GameControls.css';


const numbers = /^\d+$/;

export default function GameControls() {
  const game = useSelector(gameSelector);
  const dispatch = useDispatch();

  const handlerChangeWidth = useDebounceCallback((width: number) => {
    dispatch(actions.actionChangeSize({ width, height: game.height }));
  }, 300, [dispatch, game.height]);
  const handlerChangeHeight = useDebounceCallback((height: number) => {
    dispatch(actions.actionChangeSize({ width: game.width, height }));
  }, 300, [dispatch, game.width]);
  const handlerChangeSpeed = useDebounceCallback((speed: number) => {
    dispatch(actions.actionChangeSpeed(speed));
  }, 300, [dispatch]);
  const handlerToggleWalls = useCallback(() => {
    dispatch(actions.actionToggleWalls());
  }, [dispatch]);
  const handlerStartGame = useCallback(() => {
    dispatch(actions.actionChangeStatus(GameStatus.ACTIVE));
  }, [dispatch]);
  const handlerPauseGame = useCallback(() => {
    dispatch(actions.actionChangeStatus(GameStatus.PAUSE));
  }, [dispatch]);
  const handlerResetGame = useCallback(() => {
    dispatch(actions.actionChangeStatus(GameStatus.INITIAL));
  }, [dispatch]);

  return (
    <div className="GameControls">
      <div className="field">
        <div className="field-label">Размер от 15х15 до 100х100</div>
        <div className="field-controls">
          <NumberField
            value={ game.width }
            min={ 15 }
            max={ 100 }
            placeholder="Ширина"
            onChange={ handlerChangeWidth }
          />
          x
          <NumberField
            value={ game.height }
            min={ 15 }
            max={ 100 }
            placeholder="Высота"
            onChange={ handlerChangeHeight }
          />
        </div>
      </div>
      <div className="field">
        <div className="field-label">Скорость (10 - 100)</div>
        <div className="field-controls">
          <NumberField
            value={ game.speed }
            min={ 10 }
            max={ 100 }
            placeholder="Скорость"
            onChange={ handlerChangeSpeed }
          />
        </div>
      </div>
      <div className="field">
        <div className="field-label">
          <label htmlFor="hasWalls">Прохождение сквозь стены</label>
        </div>
        <div className="field-controls">
          <input type="checkbox" id="hasWalls" onChange={ handlerToggleWalls } checked={ !game.hasWalls } />
        </div>
      </div>
      <div className="field">
        { game.status !== GameStatus.END && (
          <button disabled={ GameStatus.ACTIVE === game.status } onClick={ handlerStartGame }>
            { game.status !== GameStatus.INITIAL ? 'Продолжить' : 'Старт' }
          </button>
        ) }
        { [GameStatus.ACTIVE, GameStatus.PAUSE].includes(game.status) && (
          <button disabled={game.status !== GameStatus.ACTIVE} onClick={ handlerPauseGame }>Пауза</button>
        ) }
        { game.status === GameStatus.END && (
          <button onClick={ handlerResetGame }>Начать сначала</button>
        ) }
      </div>
    </div>
  );
};
