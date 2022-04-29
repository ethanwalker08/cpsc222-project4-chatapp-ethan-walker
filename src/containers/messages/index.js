import React from "react";
import './style.css';

import {connect} from "react-redux";
import get_users_friends from "../../store/Action"
import { Router } from 'react-router-dom';
import logo from '../../assets/logo.svg'

import Header from './header';
import NavMini from './nav-mini';
import Friends from './friends';
import Contacts from './contacts';
import Invites from './invites';
import Welcome from './welcome';
import Chatbox from './chatbox';
import Emptychat from './emptychat';


import $ from 'jquery';

window.$ = window.jQuery = require('jquery');


class Message extends React.Component{
    constructor()
    {
        super();
        this.state ={
            message: ''
        }
    }    
    elementDidMount() {
        if(this.props.login.length > 0)
            this.props.get_users_friends(this.props.login[0].uid);
            
        $(".dropdown").on("click",function(e){
            if(!$(this).hasClass("show")){
                $(this).addClass("show");
                $(this).find(".dropdown-menu").addClass("animate fadeIn show").css({"display":"block"});
            }
            else{
                $(this).removeClass("show");
                $(this).find(".dropdown-menu").removeClass("animate fadeIn show").removeAttr("style");
            }
        });

        $("button.openleft, button[data-toggle='modal']").on("click", function(){
            $("#content-aside").addClass("show").css({"display":"block"});
            $("#chat-nav").css({"transform":"translate3d(0,0,0)"});
            $("body").append("<div class='modal-backdrop show'></div>");

            $(".modal-backdrop").on("click", function(){
                $("#content-aside").removeClass("show").css({"display":"none"});
                $("#chat-nav").css({"transform":"translate3d(-100%,0,0)"});
                $(".modal-backdrop").remove();
            })
        })
        $("#search-tab").on("click", function(){
            $("div.active").removeClass("active");
            $(this).addClass("active");
            $(".tab-pane").hide().removeClass("show active");
            $("#search").show().addClass("show active");
        })
        $("#friends-tab").on("click", function(e){
            $("div.active").removeClass("active");
            $(this).addClass("active");
            $(".tab-pane").hide().removeClass("show active");
            $("#friends").show().addClass("show active");
        })
        $("#invites-tab").on("click", function(e){
            $("div.active").removeClass("active");
            $(this).addClass("active");
            $(".tab-pane").hide().removeClass("show active");
            $("#invites").show().addClass("show active");
        })
    }
    render(){
        let loggedin = (this.props.login.length > 0) ? true : false;
        let redirect = "/";
        return(
            <div className="layout-row">
                {!loggedin ? <Router to={redirect}/> : ""}
                { loggedin && (
                <div id="main" className="layout-column flex">
                    <Header login={this.props.login[0]}/>

                    {/* ############ Content START*/}
                    <div id="content" className="flex">
                    {/* ############ Main START*/}
                    <div className="d-flex flex fixed-content">
                        <div className="aside aside-sm" id="content-aside">
                            <div className="d-flex flex-column w-xl modal-dialog bg-body" id="chat-nav">
                                <NavMini login={this.props.login[0]} />
                                <ul className="nav nav-tabs">
                                    <li className="nav-item" style={{width:'33%'}}>
                                        <div className="nav-link active" id="friends-tab">Friends</div>
                                    </li>
                                    <li className="nav-item" style={{width:'33%'}}>
                                        <div className="nav-link" id="search-tab">Search</div>
                                    </li>
                                    <li className="nav-item" style={{width:'33%'}}>
                                        <div className="nav-link" id="invites-tab">Invites</div>
                                    </li>
                                </ul>                                                                    
                                <div className="tab-content mb-4" style={{height:'100%'}}>
                                    <div className="tab-pane fade show active" id="friends" style={{height:'100%'}}>
                                        <Friends login={this.props.login[0]} chattingwith={this.props.chattingwith} />
                                    </div>
                                    <div className="tab-pane fade" id="search" style={{height:'100%'}}>
                                        <Contacts login={this.props.login[0]} chattingwith={this.props.chattingwith} />
                                    </div>
                                    <div className="tab-pane fade" id="invites" style={{height:'100%'}}>
                                        <Invites login={this.props.login[0]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex pr-md-3" id="content-body">
                        <div className="d-flex flex-column flex card m-0 mb-md-3" id="chat-list">
                            <div className="navbar flex-nowrap b-b">
                                <button data-toggle="modal" data-target="#content-aside" data-modal className="d-md-none btn btn-sm btn-icon no-bg btnmenu">
                                    <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
                                        <line x1={3} y1={12} x2={21} y2={12} />
                                        <line x1={3} y1={6} x2={21} y2={6} />
                                        <line x1={3} y1={18} x2={21} y2={18} />
                                    </svg>
                                    </span>
                                </button>
                                <span className="text-ellipsis flex mx-1"><span className="text-md text-highlight mx-2 frientname">{this.props.chattingwith.hasOwnProperty('name') ? this.props.chattingwith.name : ""}</span> </span><span className="flex" />
                            </div>
                            {this.props.chattingwith.hasOwnProperty('uid') ? <Chatbox chat={this.props.chat} login={this.props.login[0]} chattingwith={this.props.chattingwith} /> : <Welcome login={this.props.login[0]} />}
                            {this.props.chattingwith.hasOwnProperty('uid') && (<Emptychat login={this.props.login[0]} chattingwith={this.props.chattingwith}/>)}
                        </div>
                        </div>
                    </div>
                    </div>

                </div>
                )
                }
            </div>
        )
    }
}

const mapStateToProp = (state) => ({
    login: state.login,
    friends: state.friends,
    chattingwith: state.chattingwith,
    chat: state.chat
})
const mapDispatchToProp = (dispatch) => ({
    get_users_friends: (uid)=> dispatch(get_users_friends(uid))
})

export default connect(mapStateToProp, mapDispatchToProp)(Message);