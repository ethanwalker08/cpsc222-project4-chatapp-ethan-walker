import React from "react";
import logo from '../../assets/logo.svg';
import './style.css';
import { Link } from 'react-router-dom';
import {connect} from "react-redux";
import { create_user, show_alert, remove_alert} from "../../store/action";
import { Redirect } from 'react-router-dom';

import AlertHelper from '../alerts/alerthelper';

class Signup extends React.Component{
    constructor(){
        super();
        this.state ={
          email: '',
          password: '',
          loggedin: false,
          redirect: ''
        }
    }
    handle_email = (e) => {
        if (e.keyCode === 13)
        {
            const passwordField = document.querySelector(`input[name=password]`);
            passwordField.focus();
        }
        else{
            this.setState({email: e.target.value});
        }
    }
    handle_password = (e) => {
        if (e.keyCode === 13) 
            this.handle_loginwithemailandpassword();
        else
            this.setState({password: e.target.value});
    }
    vaidate_email = (input) => {
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(input))
            return false;
        else
            return true;
    }
    handle_signupwithemailandpassword = () => {
        if(this.props.login.length === 0)
        {       
            let email = this.state.email.trim();
            let password = this.state.password.trim();
            
            if((email !== '' && this.vaidate_email(email)) && password !== '')
            {
                this.props.create_user(email, password);
            }
            else
            {
                if(email === '' && password === ''){
                    document.querySelector(`input[name=email]`).focus();
                    this.props.show_alert("fail","Please provide email and password to create account");
                }
                else if (email === ''){
                    document.querySelector(`input[name=email]`).focus();
                    this.props.show_alert("fail","Please provide email to create account");
                }
                else if (password === ''){
                    document.querySelector(`input[name=password]`).focus();
                    this.props.show_alert("fail","Please provide password to create account");
                }
                else if(!this.vaidate_email(email)){
                    document.querySelector(`input[name=email]`).focus();
                    this.props.show_alert("fail","Please provide valid email create account");
                }
            }
        }
    }
    componentDidMount() {
        this.timerID = setInterval(() => this.redirect_to_messages(),3000);
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    redirect_to_messages() {
        if(this.props.login.length > 0){
            this.setState({
                loggedin: true,
                redirect: "/message"
            });

            this.props.remove_alert();
        }
    }

    render(){

        let showalert = false;
        if(this.props.alerts.length > 0)
            showalert=true;

        return(
            <div className="w-xl w-auto-sm mx-auto py-5">
                {this.state.loggedin ? <Redirect push to={this.state.redirect}/> : ""}
                <div className="p-4 d-flex flex-column">
                    {/* brand */} 
                    <div className="navbar-brand d-inline align-self-center" style={{display: "block"}}>                    
                        <img src={logo} alt="..." width="56" height="39" className="Mini-App-logo"/>
                        <span className="hidden-folded d-inline l-s-n-1x align-self-center" style={{color: "#61dafb"}}>React Chat App</span> 
                    </div>
                    {/* / brand */}
                </div>
                <div className="card mx-2">
                    { showalert ? <AlertHelper type={this.props.alerts[0].type} message={this.props.alerts[0].message}/> : ""}
                    <div id="content-body">
                        <div className="p-3 p-md-5">
                            <h5>Welcome</h5>
                            <p><small className="text-muted">Sign up to manage enjoy</small></p>
                            
                                <div className="form-group"><label>Email</label><input type="email" className="form-control" placeholder="Enter email" name="email" onKeyDown={this.handle_password} onChange={this.handle_email} value={this.state.email}/></div>
                                <div className="form-group">
                                    <label>Password</label><input type="password" className="form-control" placeholder="Password" name="password" onKeyDown={this.handle_password} onChange={this.handle_password} value={this.state.password}/>
                                </div>
                                <button onClick={this.handle_signupwithemailandpassword} className="btn btn-primary mb-1">Sign up</button>
                                <div>Already have an account? <Link to="/" className="text-primary">Sign in</Link></div>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProp = (state) => ({
    login: state.login,
    alerts: state.alerts
})
const mapDispatchToProp = (dispatch) => ({
    create_user: (email, password)=> dispatch(create_user(email, password)),
    show_alert: (alerttype, alertmessage)=> dispatch(show_alert(alerttype, alertmessage)),
    remove_alert: ()=> dispatch(remove_alert())
})

export default connect(mapStateToProp, mapDispatchToProp)(Signup);