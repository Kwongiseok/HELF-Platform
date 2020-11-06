import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import styled from 'styled-components';
import { Redirect, withRouter } from 'react-router-dom';
import LogoBox from "../Components/LogoBox"

import NaverLogin from 'react-login-by-naver';

//Google Login
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

  //Google Login Success
  responseGoogle = (res) => {
    this.setState({
      id: res.googleId,
      name: res.profileObj.name,
      email: res.profileObj.email,
      provider: 'google',
      isLogin : true,
    });
    
    console.log(this);
    this.doSignUp();
  };

  //Google Login Fail
  responseGoogleFail = (err) => {
    console.err(err);
  };

  //Naver Login Success
  responseNaver = (res) => {
    this.setState({
      id: res.id,
      name: res.name,
      email: res.email,
      provider : 'naver',
      isLogin : true,
    });
  }

  //Naver Login Fail
  responseNaverFail = (err) => {
    console.err(err);
  }

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
        <LogoContainer>
          <LogoBox/>
        </LogoContainer>
        <TextSNS>SNS로그인으로 간편하게</TextSNS>
        <LoginContainer>
          <GoogleLogin
            clientId={clientID}
            buttonText='Google'
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogleFail}
          />
          <NaverLogin
            clientId="oHvHR1J4ah36qMMt19YX"
            callbackUrl="https://helf.ml/home"
            render={(props) => <button onClick={props.onClick}>Naver</button>}
            onSuccess={this.responseNaver}
            onFailure={this.responseNaverFail}
          />
        </LoginContainer>
        {this.state.isLogin && <Redirect to = "/home"/>}
      </Container>
    );
  }
}

const TextSNS = styled.div`
  font-size: 12px;
  text-align : center;
  padding : 4px 0 12px 0;
`;

const LogoContainer = styled.div`
  display : flex;
  justify-content : space-around;
  padding : 100px 0 30px 0;
`;

const LoginContainer = styled.div`
  display : flex;
  justify-content : center;
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
