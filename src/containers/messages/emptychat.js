import React from 'react';

import {connect} from "react-redux";
import send_message from "../../store/Action"

class Emptychat extends React.Component{
    constructor()
    {
        super();
        this.state ={
            message: ''
        }
    }
    chat_id = (loginuserid, chatuserid) => {
        if(loginuserid > chatuserid)
            return chatuserid + "-" + loginuserid;
        else
            return  loginuserid + "-" + chatuserid;
    }
    handle_message = (e) => {
        if (e.keyCode === 13)
        {
            this.send_message();
        }
        else{
            this.setState({message: e.target.value});
        }
    }
    send_message = () => {
        if(this.state.message.trim() !== ""){
            this.setState({
                message: ''
            })
            let chat_id = this.chat_id(this.props.login.uid, this.props.chattingwith.uid);
            this.props.send_message(chat_id, {message: this.state.message, sender_name: this.props.login.name, sender_id: this.props.login.uid, reciever_id: this.props.chattingwith.uid, timestamp: Date.now()});
        }
    }
    render(){
        return(
            <div className="mt-auto b-t" id="chat-form">
                <div className="p-2">
                    
                    <div className="input-group">
                        <input type="text" className="form-control p-3 no-shadow no-border" placeholder="Say something" id="newField" value={this.state.message} onKeyDown={this.handle_message} onChange={this.handle_message} /> 
                        <button className="btn btn-icon btn-rounded gd-success" type="button" id="newBtn" onClick={ ()=>{this.send_message()} }>
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-up">
                            <line x1={12} y1={19} x2={12} y2={5} />
                            <polyline points="5 12 12 5 19 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProp = (dispatch) => ({
    send_message: (chat_id, newmessage) => dispatch(send_message(chat_id, newmessage))
})

export default connect(null, mapDispatchToProp)(Emptychat);