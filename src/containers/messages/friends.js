import React from 'react';

import {connect} from "react-redux";

import get_users_friends from "../../store/Action"
import get_message from "../../store/Action"

class Friends extends React.Component{
    constructor()
    {
        super();
        this.state ={
            search: ''
        }
    }
    handle_input = (e) => {
        this.setState({search: e.target.value});
    }
    chat = (v) => {
        let chat_id = this.chat_id(this.props.login.uid, v.uid);
        this.get_messages(chat_id, v);
    }
    chat_id = (loginuserid, chatuserid) => {
        if(loginuserid > chatuserid)
            return chatuserid + "-" + loginuserid;
        else
            return loginuserid + "-" + chatuserid;
    }
    get_messages = (chat_id, chatting_with) => {
        this.props.get_message(chat_id, chatting_with);
    }

    render(){
        return(
            <React.Fragment>
                <div className="navbar">
                    <div className="input-group flex bg-light rounded">
                        <input type="text" className="form-control no-bg no-border no-shadow search" placeholder="Search Friend" onChange={this.handle_input} value={this.state.search} /> 
                        <span className="input-group-append">
                        <button className="btn no-bg no-shadow" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-search text-fade">
                            <circle cx={11} cy={11} r={8} />
                            <line x1={21} y1={21} x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                        </span>
                    </div>
                </div>

                <div className="scrollable hover" style={{height:'100%'}}>
                    {this.props.friends.filter(o => Object.keys(o).some(k => o[k].includes(this.state.search.toLowerCase()))).length > 0 ? (
                    <div className="list list-row" style={{height:'100%'}}>
                        {this.props.friends.filter(o => Object.keys(o).some(k => o[k].includes(this.state.search.toLowerCase()))).map((v,i)=>{
                            return (v.uid !== this.props.login.uid && ( <div className={v.uid === this.props.chattingwith.uid ? "list-item activechat" : "list-item" } onClick={()=>{ this.chat(v) }} key={i}>
                                    {(v.hasOwnProperty('profile') && v.profile !== null && v.profile !== "") ? <span className="avatar w-40 gd-primary friendprofileimage" style={{padding:0}}><img src={v.profile} alt={v.name+" profile"} /></span> : <span className="avatar w-40 gd-success friendprofileimage" style={{padding:0}}>{v.name[0].toUpperCase()}</span> }
                                    <div className="friendloginstatus"><span className={v.status === "login" ? "avatar-status on" : "avatar-status off"} /></div>
                                    <div className="flex" style={{padding:"0"}}>
                                        <div className="item-author text-color">{v.name}</div>
                                    </div>
                                    <div />
                                </div>))
                        })}
                    </div>) :
                    <React.Fragment>
                    <div className="no-result" style={{display:'none', position:'absolute', top: '50%', left:'25%'}}>
                        <div className="p-4 text-center"><b>No Friend</b></div>
                    </div>
                    <div className="no-result" style={{position:'absolute', top: '50%', left:'25%'}}>
                        <div className="p-4 text-center"><b>No Friend</b></div>
                    </div>
                    </React.Fragment>
                    }
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProp = (state) => ({
    friends: state.friends,
    chattingwith: state.chattingwith,
    chat: state.chat
})
const mapDispatchToProp = (dispatch) => ({
    get_users_friends: (uid)=> dispatch(get_users_friends(uid)),
    get_message: (chat_id, chattingwith)=> dispatch(get_message(chat_id, chattingwith))
})

export default connect(mapStateToProp, mapDispatchToProp)(Friends);