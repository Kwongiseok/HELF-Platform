// 로그인 했을 때만 페이지를 보여줌

import React, { Component } from 'react';
import Store from '../Store/store';
import LoginContainer from './LoginContainer';

const withLogin = (WrappedComponent) =>
  class IsLogin extends Component {
    render() {
      return (
        <Store.Consumer>
          {(store) => {
            if (store.logged === false) return <LoginContainer />;
            else return <WrappedComponent />;
          }}
        </Store.Consumer>
      );
    }
  };

export default withLogin;
