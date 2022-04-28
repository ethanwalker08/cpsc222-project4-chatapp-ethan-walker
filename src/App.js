import './App.css';

import Signin from "./containers/Signin";
import Signup from "./containers/Signup";
import Message from "./containers/messages";

import {  Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
        <Route path="/" component={Signin} exact />
        <Route path="/signup" component={Signup} />
        <Route path="/message" component={Message} />
      </Routes>
  );
}

export default App;