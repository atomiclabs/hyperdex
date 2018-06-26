import React from 'react';
import Success from 'components/Success';
import {translate} from '../../translate';

const t = translate('portfolio');

const CreatePortfolioStep4 = () => <Success>{t('create.success')}</Success>;

export default CreatePortfolioStep4;
