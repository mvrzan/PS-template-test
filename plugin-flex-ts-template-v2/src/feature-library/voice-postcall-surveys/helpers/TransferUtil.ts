import ApiService from '../../../utils/serverless/ApiService';
import { EncodedParams } from '../../../types/serverless';

class TransferUtil extends ApiService {
  transferToSurvey = async (callSid: string, callerId: string, taskSid: string) => {
    const encodedParams: EncodedParams = {
      Token: encodeURIComponent(this.manager.store.getState().flex.session.ssoTokenPayload.token),
      callSid,
      callerId: encodeURIComponent(callerId),
      taskSid,
    };

    return this.fetchJsonWithReject(
      `${this.serverlessProtocol}://${this.serverlessDomain}/features/voice-postcall-surveys/survey-transfer`,
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
