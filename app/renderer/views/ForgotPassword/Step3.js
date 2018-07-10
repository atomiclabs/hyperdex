import React from 'react';
import Success from 'components/Success';
import {translate} from '../../translate';

const t = translate('forgot-password');

const ForgotPasswordStep3 = () => <Success>{t('success')}</Success>;

export default ForgotPasswordStep3;
