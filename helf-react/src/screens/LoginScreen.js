import React, {Component} from 'react';
import { GoogleLogin } from 'react-google-login';
import styled from 'styled-components';

const clientID = "170179425708-lu3v7mptq4jn95giek3kbv845eov647l.apps.googleusercontent.com";

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state= {
            id : '',
            name : '',
            provider :'',
        }
    }

    //Login Success
        responseGoogle = (res) => {
            console.log(res);
        }
    //Login Fail
    responseFail = (err) => {
        console.err(err);
    }
    render() {
        return (
            <Container>
                <Login>
                    <GoogleLogin
                        clientId ={clientID}
                        buttonText = "Google Login"
                        onSuccess = {this.responseGoogle}
                        onFailure = {this.responseFail}
                    />
                </Login>
            </Container>
        );
    }
}
const Login = styled.div`
    display : flex;
    position : absolute;
    top:50%;
    left:50%;
    justifyContent : "center";
    alignItems : "center";
    transform: translate(-50%,-50%);
`
const Container =styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #D9AFD9;
    background-image: linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%);

`; 
export default LoginScreen;
