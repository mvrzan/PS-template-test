const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const ConversationOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);

const requiredParameters = [
  {
    key: 'taskSid',
    purpose: 'Task SID of the original Task that will be used for the survey Task',
  },
  {
    key: 'customerAddress',
    purpose: 'Customer phone number that will be used to send a survey message',
  },
  {
    key: 'surveySmsPhoneNumber',
    purpose: 'Phone number of the SMS survey',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const surveyFlowSid = context.TWILIO_FLEX_SMS_SURVEY_FLOW_SID;
  const surveySmsPhoneNumber = event.surveySmsPhoneNumber;
  const taskSid = event.taskSid;
  const customerAddress = event.customerAddress;
  const target = 'studio';

  const createConversationParams = {
    context,
    attributes: JSON.stringify({
      friendlyName: 'sms-survey',
      taskSid,
    }),
  };

  try {
    const createConversationResult = await ConversationOperations.createConversation(createConversationParams);
    const conversationSid = createConversationResult.conversation.sid;

    const studioWebhookParams = {
      context,
      conversationSid,
      target,
      surveyFlowSid,
    };

    const attachConversationWebhookResult = await ConversationOperations.addStudioWebhook(studioWebhookParams);

    const addParticipantsParams = {
      context,
      conversationSid,
      customerAddress,
      surveySmsPhoneNumber,
    };

    const addParticipantsResult = await ConversationOperations.addParticipants(addParticipantsParams);

    const sendMessageParams = {
      context,
      conversationSid,
      author: 'Alloprof Survey',
      body: 'We would love to hear back from you!',
    };

    const sendMessageResult = await ConversationOperations.sendMessage(sendMessageParams);

    response.setBody({
      createConversationResult,
      attachConversationWebhookResult,
      addParticipantsResult,
      sendMessageResult,
    });

    return callback(null, response);
  } catch (err) {
    return handleError(err);
  }
});
