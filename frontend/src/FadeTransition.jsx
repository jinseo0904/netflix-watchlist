import React from 'react';
import { CSSTransition } from 'react-transition-group';
import './FadeTransition.css'; // Make sure to create this CSS file

const FadeTransition = ({ children, location }) => {
  return (
    <CSSTransition
      key={location.key}
      classNames="fade"
      timeout={300}
    >
      {children}
    </CSSTransition>
  );
};

export default FadeTransition;
