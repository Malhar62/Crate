import { ActionTypes } from "../Constants";


const initialState = {
    crateName: '',
    crateDescription: '',
    photos: [],
    contacts: [],
    isFavorite: false,
    crateTime: '',
    crateId: ''
}
export default function crateDetailReducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.CHANGE_CRATE_NAME:
            return {
                ...state,
                crateName: action.payload
            }
        case ActionTypes.EMPTY_NAME:
            return {
                ...state,
                crateName: action.payload,
                crateDescription: action.payload,
                photos: [],
                isFavorite: false,
                crateTime: '',
                crateId: ''
            }
        case ActionTypes.ADD_PHOTO:
            var dupli = [...state.photos];
            dupli.push(action.payload);
            return {
                ...state,
                photos: dupli
            }
        case ActionTypes.REMOVE_CONTACT:
            var dupli = [...state.contacts];
            dupli.splice(action.payload, 1);
            return {
                ...state,
                contacts: dupli
            }
        case ActionTypes.REMOVE_PHOTO:
            var dupli = [...state.photos];
            dupli.splice(action.payload, 1);
            return {
                ...state,
                photos: dupli
            }

        case ActionTypes.CURRENT_CRATE:
            var { crateName, crateId, photos, contacts, isFavorite, crateDescription, crateTime } = action.payload

            return {
                ...state,
                crateName, crateId, photos, contacts, isFavorite, crateTime, crateDescription
            }

        default:
            return state;
    }
}