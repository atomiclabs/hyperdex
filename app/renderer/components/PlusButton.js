import React from 'react';
import './PlusButton.scss';

const PlusButton = ({className, ...props}) => <button {...props} type="button" className={`${className} PlusButton`}/>;

export default PlusButton;
