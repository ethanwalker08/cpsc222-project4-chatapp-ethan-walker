import firebase from "src\config\firebase.js";

const addUser = (data)=>{
    return(dispatch)=>{
        dispatch({type:"ADDUSER", data:data })
    }
}

const create_user = (email, password) =>{
    return (dispatch) =>{
        firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
            // Signed in 
            var user = userCredential.user;

            console.log("User created successfully!");
            console.log("user==>",user);

            const newuser = {
                name: user.email.substring(0, email.lastIndexOf("@")),
                email: user.email,
                profile: user.photoURL,
                status_message: '',
                uid: user.uid,
                authprovide: "emailpassword",
                status: "login"
            }

            localStorage.setItem("login", JSON.stringify(newuser));

            firebase.database().ref("/").child(`user/${user.uid}`).set(newuser).then(()=>{
                //alert("user added in firebase database");
                //console.log("user added in firebase database");
                dispatch({ type: "LOGIN", data:newuser });

                let alertmessage = {
                    type: 'success',
                    message: 'Account created successfully!'
                }
                dispatch({ type: "ALERTS", data:alertmessage });
            });            
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            //console.log("Sorry! Unable to create user.");
            console.log("errorCode==>",errorCode);
            console.log("errorMessage==>",errorMessage);

            if(errorCode === "auth/email-already-in-use")
            {
                //alert("Email already in use, please use different email");
                let alertmessage = {
                    type: 'fail',
                    message: 'Email already in use, please use different email'
                }
                dispatch({ type: "ALERTS", data:alertmessage });
            }
            else
            {
                let alertmessage = {
                    type: 'fail',
                    message: 'Sorry! Unable to create user.'
                }
                dispatch({ type: "ALERTS", data:alertmessage });
            }
        });
    }
}

const login_user = (email, password) =>{
    return (dispatch) =>{
        firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
            // Signed in
            var user = userCredential.user;

            const newuser = {
                name: user.displayName !== null ? user.displayName : user.email.substring(0, email.lastIndexOf("@")),
                email: user.email,
                profile: user.photoURL,
                status_message: '',
                uid: user.uid,
                authprovide: "emailpassword",
                status: "login"
            }

            //console.log("User logged in successfully!");
            //console.log("user==>",user);
            firebase.database().ref('/').child(`user/${newuser.uid}`).once("value", (response)=>{
                //console.log(response.val());
                var userdetails = response.val();

                if(userdetails != null && userdetails.status_message.trim() != "")
                    newuser.status_message = userdetails.status_message.trim();
            })
            
            localStorage.setItem("login", JSON.stringify(newuser));

            firebase.database().ref("/").child(`user/${newuser.uid}`).update({'status': 'login'}).then(()=>{
                dispatch({ type: "LOGIN", data:newuser });

                let alertmessage = {
                    type: 'success',
                    message: 'User logged in successfully!'
                }
                dispatch({ type: "ALERTS", data:alertmessage });
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            //console.log("Sorry! Unable to login in user.");
            console.log("errorCode==>",errorCode);
            console.log("errorMessage==>",errorMessage);
            //alert("User with this name and password do not exists. Please create your account first.");

            let alertmessage = {
                type: 'fail',
                message: 'Sorry! Unable to login user.'
            }
            dispatch({ type: "ALERTS", data:alertmessage });
        });
    }
}

const get_status_message = () => {
    return (dispatch) =>{
        
    }
}

const set_status_message = (uid, status_message) => {
    return (dispatch) =>{
        firebase.database().ref("/").child(`user/${uid}`).update({'status_message': status_message}).then(()=>{
            let alertmessage = {
                type: 'success',
                message: 'Status message updated successfully!'
            }
            //dispatch({ type: "ALERTS", data:alertmessage });
            
        });

        const user = JSON.parse(localStorage.getItem("login"));
        user.status_message = status_message;
        localStorage.setItem("login", JSON.stringify(user));
        dispatch({ type: "UPDATESTATUSMESSAGE", data:status_message });
    }
}

const get_users_freinds = (uid) =>{
    return (dispatch) =>{
        firebase.database().ref('/').child("user/" + uid + "/friend").on('value', (snapshot) => {
            var fetched_friends = [];
            snapshot.forEach(friend => {
                var friendid= friend.val();
                //console.log(friendid);
                firebase.database().ref('/').child("user/" + friendid).once('value').then((details) => {
                    //console.log(details.val());
                    fetched_friends = [...fetched_friends, details.val()];
                    //console.log("fetched_friends===>",fetched_friends);
                    //console.log("fetched_friends===>",fetched_friends.length);
                    // if(fetched_friends.lenght > 0)
                    //     console.log("fetched_friends.lenght==>", fetched_friends.lenght);
                    dispatch({ type: "FRIENDS", data:fetched_friends });
                });
            })
        });
    }
}

const search_friends = (query, uid) =>{
    return (dispatch) =>{
        let search_matched =[];
        firebase.database().ref('/').child(`user`).orderByChild('name').startAt(query).endAt(`${query}\uf8ff`).limitToFirst(20).once('value', (response)=>{
            var datareturned = response.val();
            for(var item in datareturned){
                if(datareturned[item].uid !== uid){
                    search_matched.push(datareturned[item]);
                }
            }

            if(search_matched.length > 0){
                dispatch({ type: "SEARCHFRIENDS", data:search_matched});
            }
            else{
                dispatch({type: "SEARCHFRIENDS", data:[] });
            }
        })
    }
}

const invite_friend = (payload) =>{
    return (dispatch) =>{
        let invitation_sent = false;
        firebase.database().ref("/").child(`invites`).push(payload).then(()=>{
            localStorage.setItem("invitaion", JSON.stringify({type: "success", message: "Invitation Send!"}));
            invitation_sent = true;
        }).catch(()=>{
            if(!invitation_sent){
                localStorage.setItem("invitation", JSON.stringify({type: "fail", message: "Unable to send invitation. Please try again later"}));
            }
        });
    }
}

const get_invitation = (uid) =>{
    return(dispatch) =>{
        firebase.database().ref('/').child(`invites`).orderByChild('receiver').equalTo(uid).on("value", (response)=>{
            if(response.val() != null){
                let received_invitation = [];
                let datareturned = response.val();
                for(let item in datareturned){
                    firebase.database().ref("/").child(`user/${datareturned[item]["sender"]}`).once("value", (userdetails)=>{
                        let details = userdetails.val();
                        received_invitation.push({
                            name: details.name,
                            email: details.email,
                            profile: details.profile,
                            uid: details.uid,
                            authprovide: details.authprovide,
                            status: details.status,
                            invitation_key: item
                        });

                        if(received_invitation.length > 0){
                            dispatch({type: "RECEIVEDINVITATION", data: received_invitation })

                        }
                    })
                }
            }
            else{
                dispatch({ type: "RECEIVEDINVITATION", data: []});
            }
        })
        firebase.database().ref('/').child(`invites`).orderByChild('sender').equalTo(uid).on("value", (response)=>{            
            if(response.val() != null){
                let sent_invitation = [];
                let datareturned = response.val();
                for(let item in datareturned){
                    firebase.database().ref("/").child(`user/${datareturned[item]["receiver"]}`).once("value", (userdetails)=>{
                        //sent_invitation.push(userdetails.val());
                        let details = userdetails.val();
                        sent_invitation.push({
                            name: details.name,
                            email: details.email,
                            profile: details.profile,
                            uid: details.uid,
                            authprovide: details.authprovide,
                            status: details.status,
                            invitation_key: item
                        });

                        if(sent_invitation.length > 0){
                            dispatch({ type: "SENTINVITATION", data: sent_invitation });
                        }
                    })
                }
            }
            else{
                dispatch({ type: "SENTINVITATION", data: [] });
            }
        })
    }
}

const accept_invitation = (inviter, invited, invitation_key) => {
    return(dispatch) =>{
        firebase.database().ref("/").child(`user/${inviter}/friend`).set([invited]).then(()=>{
            firebase.database().ref("/").child(`user/${invited}/friend`).set([inviter]).then(()=>{
                console.log("friend added");
                firebase.database().ref('/').child('invites/'+invitation_key).remove();
            }).catch(()=>{
                console.log("unable to acccept invite");
            });
        }).catch(()=>{
            console.log("unable to acccept invite");
        });
    }
}

const reject_invitation = (invitation_key) =>{
    return (dispatch) =>{
        firebase.database().ref('/').child('invites/'+invitation_key).remove();
    }
}

const get_message = (chat_id, chattingWith)  =>{
    return(dispatch) =>{
        firebase.database().ref('/').child(`chats/${chat_id}`).on("value", (response)=>{
            let this_user_chat = [];
            var datareturned = response.val();
            for(var item in datareturned){
                this_user_chat.push(datareturned[item]);
            }
            if(this_user_chat.length > 0){
                dispatch({ type: "FRIENDSCHAT", DATA:{chat: this_user_chat, chattingwith: chattingwith}});
            }
            else {
                dispatch({ type: "FRIENDSCHAT"})
            }
        })
    }
}

const send_message = (chat_id, newmessage) =>{
    return(dispatch) =>{
        firebase.database().ref("/").child(`chats/${chat_id}`).push(newmessage).then(()=>{});
    }
}

const sign_out = (data) =>{
    return(dispatch) =>{
        firebase.database().ref("/").child(`user/${data.uid}`).update({'status': 'logout'}).then(()=>{
            firebase.auth().signOut().then(() => {
                localStorage.removeItem("login");
            }).catch((error) => {
                console.log("Sorry! Unable to signout.");
            });
            dispatch({ type: "LOGOUT" });
        });
    }
}

const show_alert = (alerttype, alertmessage) =>{
    return (dispatch) =>{
        dispatch({ type: "REMOVEALERTS" });
        dispatch({ type: "ALERTS", data:{type: alerttype, message: alertmessage} });
    }
}

const remove_alert = () =>{
    return (dispatch) =>{
        dispatch({ type: "REMOVEALERTS" });
    }
}

export {
    addUser,
    facebook_login,
    google_login,
    create_user,
    login_user,
    sign_out,
    show_alert,
    remove_alert,
    get_users_friends,
    search_friends,
    invite_friend,
    get_invitation,
    accept_invitation,
    reject_invitation,
    get_message,
    send_message,
    set_status_message
}