import React, { Component } from 'react';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import Store from './Store/store';
import { BrowserRouter, Route, Link } from "react-router-dom";

import withLogin from './Components/LoginHOC'; // 로그인 했을 때만 보여짐
// function App() {
//   return (
//     <LoginScreen/>
//   );
// }
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      onLogin: this.onLogin,
      onLogout: this.onLogout,
    };
  }
  // Login Func
  onLogin = () => {
    this.setState({
      logged: true,
    });
  };

  // Logout Func
  onLogout = () => {
    this.setState({
      logged: false,
    });
    const provider = window.sessionStorage.getItem('provider');
    //Google AccessToken Remove
    if (provider === 'google') {
    }
  };
  componentDidMount() {
    //컴포넌트가 만들어지고 render가 호출 된 후 호출되는 메소드
    const id = window.sessionStorage.getItem('id');
    if (id) {
      this.onLogin();
    } else {
      this.onLogout();
    }
  }
  render() {
    const { logged, onLogout } = this.state;

    return (
      <Store.Provider value={this.state}>
        <BrowserRouter>
          <Route path exact = "/" onLogin = {this.onLogin} onLogout = {this.onLogout} component = {LoginScreen} />
          <Route path  = "/home" component={HomeScreen}/>
        </BrowserRouter>
      </Store.Provider>
    );
  }
}
export default App;
