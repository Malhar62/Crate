import { FETCH_SUCCEDED, FETCH_FAILED, FETCH_NEWS, SAVE, ADD, REMOVE, EDIT } from "../Constants"

const initialState = {
    newses: [],
    name: 'Malhar Pandya',
    tag: '',
    list: []
}

export default function news(state = initialState, action) {
    switch (action.type) {
        case FETCH_SUCCEDED:
            return {
                ...state,
                // posts:action.recievedPosts.posts1,
                newses: action.recievedPosts
                //posts1:action.recievedPosts.posts2
            }
        case FETCH_FAILED:
            return [];
        case FETCH_NEWS:
            return {
                ...state,
                newses: action.payload.data
            }
        case SAVE:
            return {
                ...state,
                tag: action.payload
            }
        case ADD: {
            let array = [...state.list, action.payload]
            return {
                ...state,
                list: array
            }
        }
        case REMOVE:
            let array1 = [...state.list];
            console.log(action.payload)
            array1.splice(action.payload, 1)
            return {
                ...state,
                list: array1
            }
        case EDIT:
            let array2 = [...state.list];
            array2.splice(action.payload.index, 1, action.payload.data)

            return {
                ...state,
                list: array2
            }
        default:
            return state
    }
}