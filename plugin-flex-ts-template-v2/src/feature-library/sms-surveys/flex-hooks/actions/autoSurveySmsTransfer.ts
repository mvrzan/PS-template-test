import * as Flex from '@twilio/flex-ui';

import transferUtil from '../../helpers/TransferUtil';

export const actionHook = function SetSurveyTransfer(flex: typeof Flex, _manager: Flex.Manager) {
  // Automatically transfer to Survey IVR for SMS tasks only
  flex.Actions.addListener('beforeWrapupTask', async (payload) => {
    if (payload.task.attributes.channelType !== 'sms') return;

    const taskSid = payload.task.taskSid;
    const customerAddress = payload.task.attributes.customerAddress;

    try {
      await transferUtil.transferToSurvey(taskSid, customerAddress);
      console.log('SMS survey sent!.');
    } catch (error) {
      console.error('There was an error when transferring the SMS task to a survey flow:', error);
    }
  });
};
