import { createStore } from 'redux';
import reducers from './index';

export const store = createStore(
    reducers,
)