import React, { useState, Component } from "react";
import styled from "styled-components";
import { Link } from 'react-router-dom';

export default function RoomMakeScreen() {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("헬스");
  const [type, setType] = useState("2");

  // 제출된 방 정보 출력
  const handleSubmit = (e) => {
    console.log(`
    Title: ${title}
    Number: ${number}
    Type: ${type}
  `);
    // window.sessionStorage.setItem("title",title);
    console.log(title);
    e.preventDefault();
  };

  return (
    <Container>
      <FormBox onSubmit={handleSubmit}>
        <h1 style={{textAlign:'center'}}>방 만들기</h1>
        <TitleLabel>
          <div style ={{fontSize : '18px',fontWeight:'bold' }}>제목</div>      
          <input style={{width:'295px', height:'28px', borderRadius : '10px', border:'0', outline:'0'}}
            name='title'
            type='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </TitleLabel>

        <NumberLabel>
        <div style ={{fontSize : '18px',fontWeight:'bold' }}>인원</div>
          <select style={{width:'300px', height:'30px', textAlignLast:'center', borderRadius : '10px',border:'0', outline:'0'}}
            name='number'
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          >
            <option value='2'>2명</option>
            <option value='3'>3명</option>
            <option value='4'>4명</option>
          </select>
        </NumberLabel>

        <TypeLabel>
          <div style ={{fontSize : '18px',fontWeight:'bold' }}>운동 종류</div>
          <select style={{width:'300px', height:'30px', textAlignLast:'center', borderRadius : '10px',border:'0', outline:'0'}}
            name='type'
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value='헬스'>헬스</option>
            <option value='요가'>요가</option>
            <option value='명상'>명상</option>
          </select>
        </TypeLabel>
        <ButtonBox>
          <Yes>방 만들기</Yes>
        </ButtonBox>
      </FormBox>
    </Container>  
  );
}

// Styled Component
const Container = styled.div`
  background-color : #bdc3c7;
  width:480px;
  height:360px;
  border-radius : 20px;
  margin : auto;
  margin-top : 50px;
`;

const FormBox = styled.form`
  display : grid;
`;

const TitleLabel = styled.label`
  display : flex;
  justify-content : space-between;
  align-items:center;
  margin : 15px;
`;

const NumberLabel = styled.label`
  display : flex;
  justify-content : space-between;
  align-items:center;
  margin : 15px;
`;

const TypeLabel = styled.label`
  display : flex;
  justify-content : space-between;
  align-items:center;
  margin : 15px;
`;

const ButtonBox = styled.div`
  text-align:right;
  margin :15px;
`;

const Yes = styled.button`
  width: 100px;
  border:0;
  outline:0;
  /* font-size: 24px; */
  text-align: center;
  background-color: #3498db;
  padding: 10px;
  margin-bottom: 12px;
  text-decoration: none;
  border-radius: 10px;
  font-weight: bold;
  color: #fff;
`;

