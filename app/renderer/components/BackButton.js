import React from 'react';
import './BackButton.scss';

const BackButton = ({className, ...props}) => <button {...props} type="button" className={`${className} BackButton`}/>;

export default BackButton;
