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
			<form onSubmit={container.handleStep1Submit} style={{marginTop: '20px'}}>
				<div className="form-group">
					<Input
						onChange={container.handlePortfolioNameInputChange}
						placeholder={t('create.name')}
						value={state.portfolioName}
						autoFocus
						required
						maxLength="50"
						iconName="person"
					/>
				</div>
				<div className="form-group">
					<Input
						onChange={container.handlePortfolioPasswordInputChange}
						type="password"
						placeholder={t('create.password')}
						value={state.portfolioPassword}
						required
					/>
				</div>
				<div className="form-group">
					<Input
						ref={input => {
							container.confirmPasswordInput = input;
						}}
						onChange={container.handleConfirmPasswordInputChange}
						type="password"
						placeholder={t('create.confirmPassword')}
						value={state.confirmedPassword}
						required
						errorMessage={state.confirmedPasswordError}
					/>
				</div>
				<div className="form-group">
					<Button
						type="submit"
						value={t('create.next')}
						disabled={!(state.portfolioName && state.portfolioPassword && state.confirmedPassword)}
						style={{width: '170px', marginTop: '15px'}}
					/>
				</div>
			</form>
		</div>
	);
};

export default CreatePortfolioStep1;
