import { FETCH_SUCCEDED, FETCH_FAILED, FETCH_NEWS, SAVE, ADD, REMOVE, CHANGE } from "../Constants"
import axios from "axios"

export const fetchNews = (category) => {
    return (dispatch) => {
        axios.get('https://react-native-books-app.firebaseio.com/books.json')
            .then(response => {
                //console.log(response)
                if (response.status == 200) {
                    dispatch({
                        type: FETCH_NEWS,
                        payload: { data: response.data }
                    })
                } else {
                    Alert.alert('bad-data')
                }
            })
    }
}
export const save = (text) => {
    return (dispatch) => {
        dispatch({
            type: SAVE,
            payload: text
        })
    }
}

export const add = (text) => {
    return (dispatch, getState) => {
        const { redname } = getState().red

        let obj = {
            text: text.text + redname,
            time: text.time
        }
        
        dispatch({
            type: ADD,
            payload: obj
        })
        dispatch({
            type: CHANGE,
            payload: ''
        })
    }
}
export const remove = (index) => {
    return (dispatch) => {
        dispatch({
            type: REMOVE,
            payload: index
        })
    }
}
