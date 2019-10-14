import { Reducer, Action } from 'redux';

export interface ActionWithPayload extends Action {
  payload?: any
}
export type CustomReducer<S, A extends ActionWithPayload> = (state: S, action: A, payload: A['payload']) => S
export type CustomReducersMapObject<S, A extends ActionWithPayload> = {
  [key: string]: CustomReducer<S, A>
}


export default function createCustomReducer<S, A extends ActionWithPayload = ActionWithPayload>(
  initialState: S,
  reducers: CustomReducersMapObject<S, A>
): Reducer<S, A> {
  const reducerKeys = Object.keys(reducers);
  return (state = initialState, action) => {
    const {
      type,
      payload,
    } = action;

    if (reducerKeys.includes(type)) {
      return reducers[type](state, action, payload);
    }
    return state;
  }
}