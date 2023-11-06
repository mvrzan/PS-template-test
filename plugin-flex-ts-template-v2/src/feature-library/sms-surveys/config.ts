import { getFeatureFlags } from '../../utils/configuration';
import SmsSurveysConfig from './types/ServiceConfiguration';

const { enabled = false, survey_sms_phone_number } =
  (getFeatureFlags()?.features?.sms_surveys as SmsSurveysConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};

export const getSmsSurveyPhoneNumber = () => {
  return survey_sms_phone_number;
};
