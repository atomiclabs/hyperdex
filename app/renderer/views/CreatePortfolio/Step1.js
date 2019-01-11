import React from 'react';
import Button from 'components/Button';
import Input from 'components/Input';
import LoginBackButton from 'components/LoginBackButton';
import container from 'containers/CreatePortfolio';
import {translate} from '../../translate';
import './CreatePortfolio.scss';

const t = translate('portfolio');

const CreatePortfolioStep1 = () => {
	const {state} = container;

	return (
		<div className="CreatePortfolio">
			<LoginBackButton view="NewPortfolio" progress={0}/>
			<h1>{t('create.title')}</h1>
			<form style={{marginTop: '20px'}} onSubmit={container.handleStep1Submit}>
				<div className="form-group">
					<Input
						autoFocus
						required
						placeholder={t('create.name')}
						value={state.portfolioName}
						maxLength="50"
						iconName="person"
						onChange={container.handlePortfolioNameInputChange}
					/>
				</div>
				<div className="form-group">
					<Input
						required
						type="password"
						placeholder={t('create.password')}
						value={state.portfolioPassword}
						onChange={container.handlePortfolioPasswordInputChange}
					/>
				</div>
				<div className="form-group">
					<Input
						ref={input => {
							container.confirmPasswordInput = input;
						}}
						required
						type="password"
						placeholder={t('create.confirmPassword')}
						value={state.confirmedPassword}
						errorMessage={state.confirmedPasswordError}
						onChange={container.handleConfirmPasswordInputChange}
					/>
				</div>
				<div className="form-group">
					<Button
						type="submit"
						value={t('create.next')}
						disabled={!(state.portfolioName && state.portfolioPassword && state.confirmedPassword)}
						style={{
							width: '170px',
							marginTop: '15px',
						}}
					/>
				</div>
			</form>
		</div>
	);
};

export default CreatePortfolioStep1;
