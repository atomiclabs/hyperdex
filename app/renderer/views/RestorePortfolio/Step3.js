import React from 'react';
import Success from 'components/Success';
import {translate} from '../../translate';

const t = translate('portfolio');

const RestorePortfolioStep3 = () => <Success>{t('create.success')}</Success>;

export default RestorePortfolioStep3;
