import React from 'react';
import './ReloadButton.scss';

const ReloadButton = ({className, ...props}) => <button {...props} type="button" className={`${className} ReloadButton`}/>;

export default ReloadButton;
