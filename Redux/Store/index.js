import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import reducer from '../Reducers'
import thunk from 'redux-thunk'
import rootSagas from '../Sagas/rootSagas';

//const sagaMiddleware = createSagaMiddleware()

// export const store = createStore(reducer)
export const store = createStore(reducer, applyMiddleware(thunk))

//sagaMiddleware.run(rootSagas)