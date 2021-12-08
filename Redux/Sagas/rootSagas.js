import { call } from 'redux-saga/effects'
import { watchFetchGet } from './postSagas'

export default function* rootSagas() {
    yield call(watchFetchGet);
}