const INITIAL_STATE = {
    login: (localStorage.getItem("login") !== null && JSON.parse(localStorage.getItem("login")).status === "login") ? [JSON.parse(localStorage.getItem("login"))] : [],

    alerts: [],
    friends: [], 
    chattingwith: [],
    searched_contact: [],
    sent_invitation: [],
    received_invitation: [],
    chat: []
}

export default (state, action) => {
    switch (action.type) {
        case "ADDUSER":
            return ({
                ...state, 
                users: [...state.users, action.data]
            });
        case "ALERTS":
                return ({
                    ...state, 
                    alerts: [action.data]
                });
        case "REMOVEALERTS":
            return ({
                ...state, 
                alerts: []
            });
        case "FRIENDS":
            return ({
                ...state, 

                friends: action.data 
            });
        case "SEARCHFRIENDS":
            return ({
                ...state, 
                searched_contact: action.data
            });
        case "FRIENDSCHAT":
            return ({
                ...state, 
                chattingwith: action.data.chattingwith,
                chat: action.data.chat
            });
        case "SENTINVITATION":
            return ({
                ...state, 
                sent_invitation: action.data
            });
        case "RECEIVEDINVITATION":
            return ({
                ...state, 
                received_invitation: action.data
            });
        case "UPDATESTATUSMESSAGE":
            let updatedlogin = state.login;
            updatedlogin[0].status_message = action.data;

            return ({
                ...state, 
                login: updatedlogin
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