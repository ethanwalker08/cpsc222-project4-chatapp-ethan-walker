import React from 'react';

import {connect} from "react-redux";
import {get_invitation, search_friends, invite_friend} from "../../../store/action";

import searched_contact_image from '../../../assets/searched_contact_image.png';
import AlertHelper from '../../alerts/alerthelper';

class Contacts extends React.Component{
    constructor()
    {
        super();
        this.state ={
            search: '',

            alerts: {
                type: '',
                message: ''
            }
        }
    }
    alreadyInvited(uid) {
 
        
        return this.props.sent_invitation.some(function(el) {
          return (el.uid === uid) ? true : false;
        }); 
    }
    handle_input = (e) => {
        let query = e.target.value;
        this.setState({search: query});
        this.props.search_friends(query, this.props.login.uid);
    }
    componentDidMount()
    {
        this.props.get_invitation(this.props.login.uid);
    }

    check_localStorage_for_alert()
    {
        let thiscontext = this;
        var originalSetItem = localStorage.setItem; 
        localStorage.setItem = function(){
            document.createEvent('Event').initEvent('itemInserted', true, true);
            originalSetItem.apply(this, arguments);

            if(localStorage.getItem('invitation') !== null)
            {
                let invitation = JSON.parse(localStorage.getItem('invitation'));
                thiscontext.setState({ search: '', alerts: {type: invitation.type, message: invitation.message} });

                setTimeout(()=>{
                    localStorage.removeItem('invitation');
                    thiscontext.setState({ alerts: {type: '', message: ''} });
                }, 3000);
            }
        }
    }
    render(){
        this.check_localStorage_for_alert();
        
        let showalert = false;
        if(this.state.alerts.type !== "")
            showalert=true;

        return(
            <React.Fragment>
                <div className="navbar">
                    <div className="input-group flex bg-light rounded">
                        <input type="text" className="form-control no-bg no-border no-shadow search" placeholder="Search Contact" onChange={this.handle_input} value={this.state.search} /> 
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

                { showalert ? <AlertHelper type={this.state.alerts.type} message={this.state.alerts.message}/> : ""}
                
                { this.state.search !== "" && this.props.searched_contact.length > 0 ? (
                <div className="list list-row">                    
                    {this.props.searched_contact.map((v,i)=>{
                        return (<div className="list-item activechat btn-raised" key={i} style={{marginLeft:'2px', marginRight:'2px'}}>
                                {(v.hasOwnProperty('profile') && v.profile !== null && v.profile !== "") ? <span className="avatar w-40 gd-primary friendprofileimage" style={{padding:0}}><img src={v.profile} alt={v.name+" profile"} /></span> : <span className="avatar w-40 gd-success friendprofileimage" style={{padding:0}}>{v.name[0].toUpperCase()}</span> }
                                <div className="friendloginstatus"><span className={v.status === "login" ? "avatar-status on" : "avatar-status off"} /></div>
                                <div className="flex" style={{padding:"0"}}>
                                    <div className="item-author text-color">{v.name}</div>
                                </div>
                                { !this.alreadyInvited(v.uid) ?
                                <div style={{left:'0', padding:'0'}}><button className="btn btn-raised btn-wave w-xs blue text-white" onClick={()=>{ this.props.invite_friend({sender:this.props.login.uid, receiver: v.uid}) }}>Invite</button></div>
                                :
                                <div style={{left:'0', padding:'0'}}><button className="btn w-xs green text-white">Invited</button></div>
                                }
                            </div>)
                    })}
                </div>) :
                <div className="no-result" style={{position:'absolute', top: '50%', left:'25%'}}>
                    <img src={searched_contact_image} style={{marginLeft:'5px'}} alt=""/>
                    <div className="p-4 text-center"><b>Search Contacts</b></div>
                </div>
                }
            </React.Fragment>
        )
    }
}

const mapStateToProp = (state) => ({
    searched_contact: state.searched_contact,
    sent_invitation: state.sent_invitation
})
const mapDispatchToProp = (dispatch) => ({
    get_invitation: (uid)=> dispatch(get_invitation(uid)),
    search_friends: (query, uid)=> dispatch(search_friends(query, uid)),
    invite_friend: (payload)=> dispatch(invite_friend(payload))
})

export default connect(mapStateToProp, mapDispatchToProp)(Contacts);