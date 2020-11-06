import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import styled from 'styled-components';
import { Redirect, withRouter } from 'react-router-dom';

import Header from "../Components/Header"

const clientID =
  '170179425708-lu3v7mptq4jn95giek3kbv845eov647l.apps.googleusercontent.com';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      email: '',
      provider: '',
      isLogin : false,
    };
  }

  //Login Success
  responseGoogle = (res) => {
    this.setState({
      id: res.googleId,
      name: res.profileObj.name,
      email: res.profileObj.email,
      provider: 'google',
      isLogin : true,
    });
    this.doSignUp();

  };
  //Login Fail
  responseFail = (err) => {
    console.err(err);
  };

  doSignUp = () => {
    const { id, name, provider, email } = this.state;
    window.sessionStorage.setItem('id', id);
    window.sessionStorage.setItem('name', name);
    window.sessionStorage.setItem('provider', provider);
    window.sessionStorage.setItem('email', email);
    this.props.onLogin();
    this.props.history.push('/');
  };

  render() {
    return (
      <Container>
        <Header/>
        <Login>
          <GoogleLogin
            clientId={clientID}
            buttonText='Google Login'
            onSuccess={this.responseGoogle}
            onFailure={this.responseFail}
          />
        </Login>
        {this.state.isLogin && <Redirect to = "/home"/>}
      </Container>
    );
  }
}

const Login = styled.div`
  /* display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  justify-content: 'center';
  align-items: 'center';
  transform: translate(-50%, -50%); */
`;

const Container = styled.div`
  /* position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #d9afd9;
  background-image: linear-gradient(0deg, #d9afd9 0%, #97d9e1 100%); */
`;

export default withRouter(LoginScreen);
