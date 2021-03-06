import React, { Component } from 'react';
import styled from 'styled-components';
import logoImg from '../images/logo4.png'

export default class LogoBox extends Component{
    render(){
        return(
            <Container>
                <Logo src={logoImg}/>
                <Title>헬프</Title>
            </Container>
        );
    }
}

const Container = styled.div`
    display: flex;
    justify-content:flex-start;
    align-items:center;
`;


const Logo = styled.img`
    width: auto; height: auto;
    max-width: 114.5px;
    max-height: 90px;
    padding-top:15px;
`;

const Title = styled.h1`
    font-family:"Malgun-Godic";
    font-size: 80px;
    font-weight: 3em;
    margin : 0;
`;

