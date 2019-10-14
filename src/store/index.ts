import { createStore, combineReducers } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';
import gameReducer, { GameState } from './game';

interface RootState {
  game: GameState,
}

export function gameSelector(state: RootState) {
  return state.game;
}

const rootReducer = combineReducers<RootState>({
  game: gameReducer,
});

export default createStore(rootReducer, devToolsEnhancer({}));