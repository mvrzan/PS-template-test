import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';
import { getSmsSurveyPhoneNumber } from '../config';

class TransferUtil extends ApiService {
  transferToSurvey = async (taskSid: string, customerAddress: string) => {
    const surveySmsPhoneNumber = getSmsSurveyPhoneNumber();

    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      taskSid,
      customerAddress: encodeURIComponent(customerAddress),
      surveySmsPhoneNumber: encodeURIComponent(surveySmsPhoneNumber),
    };

    return this.fetchJsonWithReject(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/sms-surveys/sms-survey-transfer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.buildBody(encodedParams),
      },
    );
  };
}

const transferUtil = new TransferUtil();

export default transferUtil;
