import { CHANGE, DELETETICKED, TICK } from "../Constants"
const Data = [
    {
        "userId": 1,
        "id": 1,
        "title": "delectus aut autem",
        "selected": false
    },
    {
        "userId": 1,
        "id": 2,
        "title": "quis ut nam facilis et officia qui",
        "selected": false
    },
    {
        "userId": 1,
        "id": 3,
        "title": "fugiat veniam minus",
        "selected": false
    },
    {
        "userId": 1,
        "id": 4,
        "title": "et porro tempora",
        "selected": false
    },
    {
        "userId": 1,
        "id": 5,
        "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
        "selected": false
    },
    {
        "userId": 1,
        "id": 6,
        "title": "qui ullam ratione quibusdam voluptatem quia omnis",
        "selected": false
    },
    {
        "userId": 1,
        "id": 7,
        "title": "illo expedita consequatur quia in",
        "selected": false
    },
    {
        "userId": 1,
        "id": 8,
        "title": "quo adipisci enim quam ut ab",
        "selected": false
    },
    {
        "userId": 1,
        "id": 9,
        "title": "molestiae perspiciatis ipsa",
        "selected": false
    },
    {
        "userId": 1,
        "id": 10,
        "title": "illo est ratione doloremque quia maiores aut",
        "selected": false
    },
]
const initialState = {
    redname: 'NBA',
    items: Data,
    obj: {
        game: 'your name',
        obj1: {
            obj2: {
                obj3: {
                    tag: 'my name'
                }
            }
        }
    }
}

export default function red(state = initialState, action) {
    switch (action.type) {
        case CHANGE:
            return {
                ...state,
                redname: 'S curry 30'
            }
        case TICK:
            return {
                ...state,
                items: action.payload
            }
        case DELETETICKED:
            var after = state.items.filter(item => !item.selected)
            return {
                ...state,
                items: after,
                obj:{
                    ...state.obj,
                    obj1:{
                        ...state.obj1,
                        obj2:{
                            ...state.obj2,
                            obj3:{
                                ...state.oj3,
                                    tag:'my name is curry'
                            }
                        }
                    }
                }
            }
        default:
            return state
    }
}