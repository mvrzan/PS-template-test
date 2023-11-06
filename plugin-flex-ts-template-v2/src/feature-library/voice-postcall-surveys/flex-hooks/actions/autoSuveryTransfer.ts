import * as Flex from '@twilio/flex-ui';

import transferUtil from '../../helpers/TransferUtil';

export const actionHook = function SetSurveyTransfer(flex: typeof Flex, _manager: Flex.Manager) {
  // Automatically transfer to Survey IVR for Inbound calls only
  flex.Actions.addListener('beforeHangupCall', async (payload) => {
    if (payload.task.attributes.direction !== 'inbound') return;

    const callSid = payload.task.attributes.call_sid;
    const callerId = payload.task.attributes.to;
    const taskSid = payload.task.taskSid;

    try {
      await transferUtil.transferToSurvey(callSid, callerId, taskSid);
    } catch (error) {
      console.error('There was an error when transferring the call to a survey flow:', error);
    }
  });
};
