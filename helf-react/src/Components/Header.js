import React, { Component } from 'react';
import styled from 'styled-components';
import logo from '../images/logo4.png'

export default class Header extends Component{
    render(){
        return(
            <Container>
                <Logo src={logo}/>
                <Title>헬프</Title>
            </Container>
            );
    }
}

const Container = styled.span`
    display: flex;
    justify-content:flex-start;
    align-items:center;
`;


const Logo = styled.img`
    width: auto; height: auto;
    max-width: 76.3px;
    max-height: 60px;
    padding-top:15px;
`;

const Title = styled.h1`
    font-family:"Malgun-Godic";
    font-size: 50px;
    font-weight: 3em;
    margin : 0;
`;

