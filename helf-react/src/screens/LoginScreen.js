import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import NaverLogin from "react-login-by-naver";
// import NaverLogin from "@dohyeon/react-naver-login";
import KakaoLogin from "react-kakao-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import styled from "styled-components";
import { Redirect, withRouter,useHistory } from "react-router-dom";
import LogoBox from "../Components/LogoBox";
import axios from "axios";
import { v1 as uuid } from "uuid";

//Login Cient IDs
const googleID =
  "170179425708-lu3v7mptq4jn95giek3kbv845eov647l.apps.googleusercontent.com";
const naverID = "oHvHR1J4ah36qMMt19YX";
const kakaoID = "d1ff7d6c9ce92ba437a95f277ad4a992";
const facebookID = "567205533996340";


class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      email: "",
      provider: "", 
      isLogin: false,
    };

  }


  //Google Login Success
  responseGoogle = (res) => {
    this.setState({
      id: res.googleId,
      name: res.profileObj.name,
      email: res.profileObj.email,
      provider: "google",
      isLogin: true,
    });
    this.doSignUp();
    const client = axios.create();
    let name_post = this.state.name;
    let email_post = this.state.email;
    console.log(name_post);
    client.post("/api", { name_post, email_post });
  };

  //Google Login Fail
  responseGoogleFail = (err) => {
    console.log(err);
  };

  //Naver Login Success
  responseNaver = (res) => {
    this.setState({
      id: res.response.id,
      name: res.response.name,
      email: res.response.email,
      provider: "naver",
      isLogin: true,
    });
    this.doSignUp();
  };

  //Naver Login Fail
  responseNaverFail = (err) => {
    console.log(err);
  };

  //Kakao Login Success
  responseKakao = (res) => {
    this.setState({
      id: res.profile.id,
      name: res.profile.properties.nickname,
      // email: res.kakao_acount.email,
      provider: "kakao",
      isLogin: true,
    });
    this.doSignUp();
  };

  //Kakao Login Fail
  responseKakaoFail = (err) => {
    console.log(err);
  };

  //Facebook Login Success
  responseFacebook = (res) => {
    this.setState({
      id: res.id,
      name: res.name,
      email: res.email,
      provider: "facebook",
      isLogin: true,
    });
    this.doSignUp();
  };

  //Facebook Login Fail
  responseFacebookFail = (err) => {
    console.log(err);
  };

  doSignUp = () => {
    const { id, name, provider, email, isLogin } = this.state;
    window.sessionStorage.setItem("id", id);
    window.sessionStorage.setItem("name", name);
    window.sessionStorage.setItem("provider", provider);
    window.sessionStorage.setItem("email", email);
    window.sessionStorage.setItem("isLogin", isLogin);
    // this.props.onLogin();
    this.props.history.push("/");
  };

  render() {

    return (
      <Container>
        <LogoContainer>
          <LogoBox />
        </LogoContainer>

        {window.sessionStorage.isLogin ? (
          // 로그인 전
          <StartContainer>
            <StartButton Enter href='./roomList'>같이하기</StartButton>
            <StartButton Solo href={`/soloRoom/${uuid()}`}>혼자하기</StartButton> 
            <StartButton Make href='./roomMake'>방만들기</StartButton>
          </StartContainer>
        ) : (
          // 로그인 후
          <LoginContainer>
            <NaverLogin
              clientId={naverID}
              callbackUrl='http://localhost:3000/video'
              isPopup={false}
              onSuccess={this.responseNaver}
              onFailure={this.responseNaverFail}
              render={(props) => (
                <StyledContainer>
                  <StyledLogin Naver onClick={props.onClick}>
                    Naver
                  </StyledLogin>
                </StyledContainer>
              )}
            />
            <GoogleLogin
              clientId={googleID}
              render={(props) => (
                <StyledContainer>
                  <StyledLogin Google onClick={props.onClick}>
                    Google
                  </StyledLogin>
                </StyledContainer>
              )}
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogleFail}
            />

            <KakaoLogin
              token={kakaoID}
              onSuccess={this.responseKakao}
              onFail={this.responseKakaoFail}
              getProfile={true}
              render={(props) => (
                <StyledContainer>
                  <StyledLogin Kakao onClick={props.onClick}>
                    Kakao
                  </StyledLogin>
                </StyledContainer>
              )}
            />

            <FacebookLogin
              appId={facebookID}
              onSuccess={this.responseFacebook}
              onFailure={this.responseFacebookFail}
              autoLoad={false}
              fields='id,name,email'
              render={(props) => (
                <StyledContainer>
                  <StyledLogin Facebook onClick={props.onClick}>
                    Facebook
                  </StyledLogin>
                </StyledContainer>
              )}
            />
          </LoginContainer>
        )}
      </Container>
    );
  }
}

const LogoContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 100px 0 30px 0;
`;

const LoginContainer = styled.div`
  /* display : flex;
  flex-direction : column;
  justify-content : center; */
`;

const StyledLogin = styled.a`
  width: 300px;
  font-size: 24px;
  text-align: center;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
  text-decoration: none;
  background: ${(props) => {
    if (props.Naver) {
      return "#1ec800";
    } else if (props.Google) {
      return "#FE2E2E";
    } else if (props.Kakao) {
      return "#FFBF00";
    } else if (props.Facebook) {
      return "#2E64FE";
    }
  }};
  color: #fff;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.2s;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -o-transition: all 0.2s;

  &:hover {
    background: ${(props) => {
      if (props.Naver) {
        return "#169600";
      } else if (props.Google) {
        return "#c0392b";
      } else if (props.Kakao) {
        return "#ce9700";
      } else if (props.Facebook) {
        return "#1f4cc6";
      }
    }};
  }
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StartButton = styled.a`
  width: 300px;
  font-size: 24px;
  text-align: center;
  background: ${(props) => {
    if (props.Enter) return "#3498db";
    else if (props.Solo) return  "#2ecc71";
    else if(props.Make) return "#c9cfd1";
    }};

  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  color: #fff;
  transition: all 0.2s;
  -webkit-transition: all 0.2s;
  -moz-transition: all 0.2s;
  -o-transition: all 0.2s;

  &:hover {
    background: ${(props) => {
    if (props.Enter) return "#2980b9";
    else if (props.Solo) return "#27ae60";
    else if(props.Make) return "#7f8c8d";
    }};
  }
`;

const Container = styled.div`
`;

export default withRouter(LoginScreen);
