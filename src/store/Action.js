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