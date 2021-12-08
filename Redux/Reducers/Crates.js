import { ActionTypes } from "../Constants";

const initialState = {
    crates: [],
    allcontacts: []
}
export default function crateReducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.ADD_CRATE:
            var dupli = [...state.crates];
            dupli.push(action.payload);
            return {
                ...state,
                crates: dupli
            }
        /////////////////////

        case ActionTypes.ADD_FAVORITE:
            var Ind = state.crates.findIndex(item => item.crateId == action.payload);
            let obj = {
                ...state.crates[Ind],
                isFavorite: !state.crates[Ind].isFavorite
            }
            var dupli = [...state.crates];
            dupli.splice(action.payload, 1, obj)
            return {
                ...state,
                crates: dupli
            }
        /////////////////////

        case ActionTypes.FETCH_CONTACTS:
            return {
                ...state,
                allcontacts: action.payload
            }
        /////////////////////

        case ActionTypes.ADD_PHOTO_TO_CRATE:
            var Index = state.crates.findIndex(x => x.crateId == action.payload.id)
            var Tempobj = state.crates[Index];
            var dupli = [...Tempobj.photos, ...action.payload.photos]
            var extra = [...state.crates];
            var secondary = {
                ...Tempobj,
                photos: dupli
            }
            extra.splice(Index, 1, secondary)
            return {
                ...state,
                crates: extra
            }
        /////////////////////

        case ActionTypes.SELECT_CONTACT:
            var dupli = [...state.allcontacts];
            var sectionIndex = 0
            var Ind;
            var last = dupli.length;
            var i = 0;
            while (i < last) {
                Ind = dupli[i].data.findIndex(x => x.id == action.payload)
                if (Ind != -1) {
                    sectionIndex = i
                    break;
                } else {
                    i++;
                }
            }
            let obj1 = {
                ...dupli[sectionIndex].data[Ind],
                isSelected: !dupli[sectionIndex].data[Ind].isSelected
            }
            dupli[sectionIndex].data.splice(Ind, 1, obj1)
            console.log(action.payload, '--', Ind)
            return {
                ...state,
                allcontacts: dupli
            }
        /////////////////////
        case ActionTypes.ADD_CONTACT_TO_CRATE:
            var dupli = [...state.crates];
            var Index = dupli.findIndex(x => x.crateId == action.payload.id);
            var extra = [...dupli[Index].contacts, ...action.payload.data];
            var Temp = {
                ...dupli[Index],
                contacts: extra
            }
            dupli.splice(Index, 1, Temp)
            return {
                ...state,
                allcontacts: [],
                crates: dupli
            }
        /////////////////////

        case ActionTypes.DELETE_CRATE_ITEM:
            var kind = action.payload.kind
            var itemId = action.payload.itemId
            var crateId = action.payload.crateId

            var crateIndex = state.crates.findIndex(x => x.crateId == crateId);
            var crateItemIndex = (kind == 'camera' || kind == 'gallery') ?
                state.crates[crateIndex].photos.findIndex(x => x.itemId == itemId) :
                ((kind == 'contact') ? state.crates[crateIndex].contacts.findIndex(x => x.itemId == itemId) : null)

            var dupli = [...state.crates]
            if (kind == 'camera' || kind == 'gallery') {
                dupli[crateIndex].photos.splice(crateItemIndex, 1)
            } else {
                if (kind == 'contact') {
                    dupli[crateIndex].contacts.splice(crateItemIndex, 1)
                } else {
                    null
                }
            }
            return {
                ...state,
                crates: dupli
            }
        default:
            return state
    }
}