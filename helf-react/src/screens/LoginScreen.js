import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import NaverLogin from 'react-login-by-naver';
import KakaoLogin from 'react-kakao-login';
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import styled from 'styled-components';
import { Redirect, withRouter } from 'react-router-dom';
import LogoBox from "../Components/LogoBox"

//Login Cient IDs
const googleID ='170179425708-lu3v7mptq4jn95giek3kbv845eov647l.apps.googleusercontent.com';
const naverID = "oHvHR1J4ah36qMMt19YX";
const kakaoID = "d1ff7d6c9ce92ba437a95f277ad4a992";
const facebookID = "567205533996340";

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
    
    // console.log(this);
    this.doSignUp();
    
  };
<<<<<<< HEAD
  //Login Fail
  responseFail = (err) => {
    console.error(err);
=======

  //Google Login Fail
  responseGoogleFail = (err) => {
    console.log(err);
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
    console.loh(err);
  }

  //Kakao Login Success
  responseKakao = (res) => {
    this.setState({
      id: res.profile.id,
      name: res.profile.properties.nickname,
      email: res.kakao_acount.email,
      provider: 'kakao',
      isLogin : true,
    });
    
    console.log(this);
    this.doSignUp();
  };

  //Kakao Login Fail
  responseKakaoFail = (err) => {
    console.loh(err);
  };

  //Facebook Login Success
  responseFacebook = (res) => {
    this.setState({
      id: res.id,
      name: res.name,
      email: res.email,
      provider: 'facebook',
      isLogin : true,
    });
    
    console.log(this);
    this.doSignUp();
  };

  //Facebook Login Fail
  responseFacebookFail = (err) => {
    console.log(err);
>>>>>>> 109614888f2def2a299fed172fcbb2ba32bc41f9
  };

  doSignUp = () => {
    const { id, name, provider, email } = this.state;
    window.sessionStorage.setItem('id', id);
    window.sessionStorage.setItem('name', name);
    window.sessionStorage.setItem('provider', provider);
    window.sessionStorage.setItem('email', email);
    console.log('login success');
    this.props.history.push('/');
  };


  render() {
    return (
      <Container>
        <LogoContainer>
          <LogoBox/>
        </LogoContainer>
        {/* <TextSNS>SNS로그인으로 간편하게</TextSNS> */}
        {/* {this.state.isLogin && <Redirect to = "/home"/>} */}
            
        {this.state.isLogin ? 
        // 로그인 전
        <StartContainer>
          <StartButton Enter href="./video">시작하기</StartButton>
          <StartButton Make href="#">방만들기</StartButton>
        </StartContainer> : 
        
        // 로그인 후
        <LoginContainer>
          <NaverLogin
            clientId={naverID}
            callbackUrl="http://localhost:3000/"
            render={props => (
              <StyledContainer>
                <StyledLogin Naver onClick={props.onClick}>Naver</StyledLogin>
              </StyledContainer>
            )}onSuccess={this.responseNaver}
            onFailure={this.responseNaverFail}
          />
          <GoogleLogin
            clientId={googleID}
            render={props => (
              <StyledContainer>
                <StyledLogin Google onClick={props.onClick}>Google</StyledLogin>
              </StyledContainer>
            )}
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogleFail}
          />
          <KakaoLogin
            jsKey = {kakaoID}
            onSuccess = {this.responseKako}
            onFail = {this.responseKakaoFail}
            render={props => (
              <StyledContainer>
                <StyledLogin Kakao onClick={props.onClick}>Kakao</StyledLogin>
              </StyledContainer>)}
          />
<<<<<<< HEAD
        </Login>
        {/* {this.state.isLogin && <Redirect to = "/home" />} */}
=======
          <FacebookLogin
            appId={facebookID}
            onSuccess = {this.responseFacebook}
            onFailure = {this.responseFacebookFail}
            autoLoad={false}
            fields="id,name,email"
            render={props => (
              <StyledContainer>
                <StyledLogin Facebook onClick={props.onClick}>Facebook</StyledLogin>
              </StyledContainer>)}
          />  
        </LoginContainer> }
>>>>>>> 109614888f2def2a299fed172fcbb2ba32bc41f9
      </Container>
    );
  }
}

// const TextSNS = styled.div`
//   font-size: 12px;
//   text-align : center;
//   padding : 4px 0 12px 0;
// `;

const LogoContainer = styled.div`
  display : flex;
  justify-content : space-around;
  padding : 100px 0 30px 0;
`;

const LoginContainer = styled.div`
  /* display : flex;
  flex-direction : column;
  justify-content : center; */
`;

const StyledLogin = styled.a`
  width : 300px;
  font-size : 24px;
  text-align : center;
  border-radius : 10px;
  padding : 10px;
  margin-bottom : 12px;
  text-decoration:none;
  background: ${props => { 
      if(props.Naver) { return "#1ec800"}
      else if(props.Google) {return "#FE2E2E"}
      else if(props.Kakao) {return '#FFBF00'}
      else if(props.Facebook) {return '#2E64FE'}
  }};
  color:#fff; 
  border-radius: 4px; 
  font-weight:bold;
  transition: all 0.2s; -webkit-transition: all 0.2s; -moz-transition: all 0.2s; -o-transition: all 0.2s;

  &:hover{
    background: ${props => { 
      if(props.Naver) { return "#169600"}
      else if(props.Google) {return "#c0392b"}
      else if(props.Kakao) {return '#ce9700'}
      else if(props.Facebook) {return '#1f4cc6'}
  }}};
`;

const StyledContainer = styled.div`
  display : flex;
  justify-content : center;
`;

const StartContainer = styled.div`
  display : flex;
  flex-direction : column;
  align-items : center;
`;

const StartButton = styled.a`
  width : 300px;
  font-size : 24px;
  text-align : center;
  background-color : ${props => (props.Enter ? "#3498db" : "#bdc3c7")}; 
  border-radius : 10px;
  padding : 10px;
  margin-bottom : 12px;
  text-decoration:none;
  border-radius: 4px; font-weight:bold; color:#fff; transition: all 0.2s; -webkit-transition: all 0.2s; -moz-transition: all 0.2s; -o-transition: all 0.2s;

  &:hover{
    background-color : ${props => (props.Enter ? "#2980b9" : "#7f8c8d")};
  }
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
