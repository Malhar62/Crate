import { combineReducers } from 'redux'
import news from './news'
import red from './red'
import crateDetailReducer from './CrateReducer'
import crateReducer from './Crates'
const rootReducer = combineReducers({
    news, red, crateDetailReducer, crateReducer
})

export default rootReducer