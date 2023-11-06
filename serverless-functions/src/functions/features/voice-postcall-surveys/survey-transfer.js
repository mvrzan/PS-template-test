const { prepareFlexFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const CallOperations = require(Runtime.getFunctions()['common/twilio-wrappers/programmable-voice'].path);

const requiredParameters = [
  {
    key: 'callSid',
    purpose: 'SID for the conference call',
  },
  {
    key: 'callerId',
    purpose: 'Phone number of the Twilio dialed phone number',
  },
  {
    key: 'taskSid',
    purpose: 'Task SID of the original Task that will be used for the survey Task',
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const callSid = event.callSid;
  const callerId = event.callerId;
  const taskSid = event.taskSid;
  const applicationConnectSid = context.TWILIO_FLEX_SURVEY_TRANSFER_APP_SID;

  const params = {
    twiml: `<Response>
  <Say>We would love to hear back your feedback. Please stay on the line.</Say>
  <Dial>
  <Application>
  <ApplicationSid>${applicationConnectSid}</ApplicationSid>
  <Parameter name="taskSid" value="${taskSid}"/>
  <Parameter name="calledPhoneNumber" value="${callerId}"/>
  </Application>
  </Dial>
  </Response>`,
  };

  const parameters = { context, callSid, params };

  try {
    const result = await CallOperations.updateCall(parameters);

    response.setStatusCode(result.status);
    response.setBody(result);
    return callback(null, response);
  } catch (err) {
    return handleError(err);
  }
});
