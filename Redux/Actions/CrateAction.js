import { useCallback } from 'react'
import { ActionTypes } from '../Constants'

const changeCrateName = (name) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.CHANGE_CRATE_NAME,
            payload: name
        })
    }
}
const changeCrateDescription = (name) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.CHANGE_CRATE_DESRIPTION,
            payload: name
        })
    }
}

function generateString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const emptyName = () => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.EMPTY_NAME,
            payload: ''
        })
    }
}
const addCrate = (callback) => {
    return (dispatch, getState) => {
        const obj = getState().crateDetailReducer
        dispatch({
            type: ActionTypes.ADD_CRATE,
            payload: {
                ...obj,
                crateId: generateString(5)
            }
        })
        callback()
    }
}
const addPhoto = (data, callback) => {
    let adder = {
        ...data,
        itemId: generateString(6)
    }
    return (dispatch) => {
        dispatch({
            type: ActionTypes.ADD_PHOTO,
            payload: adder
        })
        callback()
    }
}
const removePhoto = (index) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.REMOVE_PHOTO,
            payload: index
        })
    }
}
const editCratePhoto = (id, callback) => {
    return (dispatch, getState) => {
        const { photos } = getState().crateDetailReducer
        dispatch({
            type: ActionTypes.ADD_PHOTO_TO_CRATE,
            payload: { photos, id }
        })
        callback()
    }
}
const addToFavorite = (crateID) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.ADD_FAVORITE,
            payload: crateID
        })
    }
}
const fetchedContacts = (data, callback) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.FETCH_CONTACTS,
            payload: data
        })
        callback()
    }
}
const selectContact = (contactId) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.SELECT_CONTACT,
            payload: contactId
        })
    }
}

const addContactToCrate = (id, callback) => {
    return (dispatch, getState) => {
        const { allcontacts } = getState().crateReducer;
        var allSelectedContacts = [];
        allcontacts.forEach(element => {
            element.data.forEach(sub => {
                if (sub.isSelected) {
                    var obj = {
                        ...sub,
                        itemId: generateString(6)
                    }
                    allSelectedContacts.push(obj)
                }
            })
        });
        console.log(allSelectedContacts)
        dispatch({
            type: ActionTypes.ADD_CONTACT_TO_CRATE,
            payload: { data: allSelectedContacts, id }
        })
        callback()
    }
}
const deleteCrateItem = (crateId, itemId, kind, callback) => {
    return (dispatch) => {
        dispatch({
            type: ActionTypes.DELETE_CRATE_ITEM,
            payload: { crateId, itemId, kind }
        })
        callback()
    }
}
export const CrateAction = {
    changeCrateName,
    changeCrateDescription,
    addCrate,
    emptyName,
    addPhoto,
    removePhoto,
    addToFavorite,
    fetchedContacts,
    editCratePhoto,
    selectContact,
    addContactToCrate,
    generateString,
    deleteCrateItem
}