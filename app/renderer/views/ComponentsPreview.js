import React from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import ReloadButton from '../components/ReloadButton';
import Input from '../components/Input';

const Container = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	padding: 50px;

	> * {
		margin: 20px;
	}
`;

const ComponentsPreview = props => (
	<Container>
		<Button value="Normal" {...props}/>
		<Button primary value="Primary"/>
		<BackButton/>
		<ReloadButton/>
		<Input value="Icon"/>
		<Input placeholder="Placeholder"/>
		<Input iconName="FaCalendar" placeholder="Icon"/>
		<Input error iconName="FaCalendar" value="Error"/>
	</Container>
);

export default ComponentsPreview;
