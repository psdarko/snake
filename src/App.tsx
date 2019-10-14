import React from 'react';
import { Provider } from 'react-redux';

import store from './store';

import Game from './Game/Game';

import './App.css';

const App: React.FC = () => {
  return (
    <Provider store={ store }>
      <div className="App">
        <Game />
      </div>
    </Provider>
  );
};

export default App;
