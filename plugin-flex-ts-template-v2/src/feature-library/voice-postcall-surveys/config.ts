import { getFeatureFlags } from '../../utils/configuration';
import VoicePostcallSurveysConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.voice_postcall_surveys as VoicePostcallSurveysConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
