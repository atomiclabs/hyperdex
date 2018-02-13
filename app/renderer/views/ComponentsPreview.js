import React from 'react';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ReloadButton from '../components/ReloadButton';
import Input from '../components/Input';
import Progress from '../components/Progress';
import './ComponentsPreview.scss';

const ComponentsPreview = () => (
	<div className="ComponentsPreview">
		<Button value="Normal"/>
		<Button primary value="Primary"/>
		<BackButton/>
		<ReloadButton/>
		<Input placeholder="Placeholder"/>
		<Input iconName="FaCalendar" placeholder="Icon"/>
		<Input disabled level="danger" value="unicorn taco lol jumping" text="Seed phrase does not match"/>
		<Progress value="0.4"/>
	</div>
);

export default ComponentsPreview;
