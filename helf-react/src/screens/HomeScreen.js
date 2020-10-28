import React, { Component } from 'react';
import styled from 'styled-components';
import VideoScreen from './VideoScreen';
import { Redirect, withRouter, Link, Route } from 'react-router-dom';

class HomeScreen extends Component {
  render() {
    return (
      <div>
        <div>보인다.</div>
        <Link to="./video">
          <button>start</button>
        </Link>
      </div >
    );
  }
}

export default HomeScreen;
