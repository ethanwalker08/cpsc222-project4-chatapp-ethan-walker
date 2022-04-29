import React from 'react';

class Chatbox extends React.Component{
    formated_date(timestamp){
        const messageTimestamp = new Date(timestamp);
        var today = new Date();

        if(messageTimestamp.toDateString() > today.toDateString()){
            let formateddatestring = messageTimestamp.toDateString() + " " +messageTimestamp.toLocaleTimeString("en-US").replace(/(.*)\D\d+/, '$1');
            return formateddatestring;
        }
        else{
            return messageTimestamp.toLocaleTimeString("en-US").replace(/(.*)\D\d+/, '$1');
        }
    }
    render(){
        return(
            <div className="scrollable hover">
                <div className="list">
                    <div className="p-3">
                        <div className="chat-list">
                            {this.props.chat.map((v,i)=>{
                                return (
                                <div key={i} className="chat-item" data-class={v.reciever_id === this.props.login.uid ? "null": "alt"} data-sr-id={i} style={{visibility: 'visible', transform: 'none', opacity: 1, transition: 'transform 0.5s cubic-bezier(0.6, 0.2, 0.1, 1) 0s, opacity 0.5s cubic-bezier(0.6, 0.2, 0.1, 1) 0s'}}>
                                    {v.sender_id === this.props.login.uid ? (
                                        <button className="avatar w-40 areplacement" style={{padding:0}}>{(this.props.login.hasOwnProperty('profile') && this.props.login.profile !== '' && this.props.login.profile !== null) ? <img src={this.props.login.profile} alt="." /> : <span className="avatar w-40 gd-success" style={{margin: "-2px"}}>{this.props.login.name[0].toUpperCase()}</span>}</button>
                                    ) : (
                                        <button className="avatar w-40 areplacement" style={{padding:0}}>{(this.props.chattingwith.hasOwnProperty('profile') && this.props.chattingwith.profile !== '' && this.props.chattingwith.profile !== null) ? <img src={this.props.chattingwith.profile} alt="." /> : <span className="avatar w-40 gd-info" style={{margin: "-2px"}}>{this.props.chattingwith.name[0].toUpperCase()}</span>}</button>
                                    )}
                                    <div className="chat-body">
                                        <div className="chat-content rounded msg bg-body">{v.message}</div>                                                    
                                        <div className="chat-date date">{this.formated_date(v.timestamp)}</div>
                                    </div>
                                </div>
                                )
                            })}
                            {this.props.chat.length <= 0 && ( <div className="p-4 text-center rounded bg-body emptyChat">No Message! Start Chatting</div> )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Chatbox;