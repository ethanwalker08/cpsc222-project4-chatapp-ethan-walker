const INITIAL_STATE = {
    login: (localStorage.getItem("login") !== null && JSON.parse(localStorage.getItem("login")).status === "login") ? [JSON.parse(localStorage.getItem("login"))] : [],

    alerts: [],
    friends: [],
    chattingWith: [],
    chat: []
}
function reducer(state, action){
    switch(action.type) {
        case "ADDUSER":
            return({
                ...state,
                users: [...state.users, action.data]
            });
        case "ALERTS":
            return({
                ...state, 
                alerts: action.data
            });
        case "REMOVEALERTS":
            return ({
                ...state, 
                alerts: []
            });
        case "FRIENDS":
            return({
                ...state,
                friends: action.data
            });
            case "FRIENDSCHAT":
                return ({
                    ...state, 
                    chattingwith: action.data.chattingwith,
                    chat: action.data.chat
                });
            case "LOGIN":
                return ({
                    ...state, 
                    login: [...state.login, action.data],
                    friends: []
                });
            case "LOGOUT":
                return ({
                    ...state, 
                    login: [],
                    friends: []
                });
            default:
                return state = INITIAL_STATE;         
    }
}
export default reducer;