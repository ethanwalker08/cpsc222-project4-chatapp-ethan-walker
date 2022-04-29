import React from "react";
import "./style.css";
import $ from 'jquery';

window.$ = window.jQuery = require('jquery');

class Info extends React.Component{
    componentDidMount() {
        $(".close").on("click", function(){
            $(this).parent().remove();
        });
    }
    render(){
        return(<div className="alert alert-info alert-dismissible fade show m-2" role="alert">
                <div className="d-flex">
                    <div className="mx-3"><strong>Info!</strong> { this.props.message }</div>
                </div>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>)
    }
}


export default Info;