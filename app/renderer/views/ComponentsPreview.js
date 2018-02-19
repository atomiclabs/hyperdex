import React from 'react';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ReloadButton from '../components/ReloadButton';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Progress from '../components/Progress';
import './ComponentsPreview.scss';

const ComponentsPreview = () => (
	<div className="ComponentsPreview">
		<Button value="Normal"/>
		<Button primary value="Primary"/>
		<BackButton/>
		<ReloadButton/>
		<Input placeholder="Placeholder"/>
		<Input disabled placeholder="Disabled"/>
		<Input iconName="person" placeholder="Icon"/>
		<Input disabled iconName="person" placeholder="Icon & disabled"/>
		<Input disabled level="success" value="Success" message="Successfully did awesome"/>
		<Input defaultValue="Error" errorMessage="Seed phrase does not match"/>
		<TextArea defaultValue="TextArea"/>
		<Progress value="0.4"/>
	</div>
);

export default ComponentsPreview;
