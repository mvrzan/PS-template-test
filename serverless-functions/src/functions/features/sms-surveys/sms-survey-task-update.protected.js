const { prepareStudioFunction } = require(Runtime.getFunctions()['common/helpers/function-helper'].path);
const TaskrouterOperations = require(Runtime.getFunctions()['common/twilio-wrappers/taskrouter'].path);
const ConversationOperations = require(Runtime.getFunctions()['common/twilio-wrappers/conversations'].path);

const requiredParameters = [
  {
    key: 'customerRating',
    purpose: 'Customer IVR rating',
  },
  {
    key: 'taskSid',
    purpose: 'Task SID of the original Task that will be used for the survey Task',
  },
  {
    key: 'conversationSid',
    purpose: 'Conversation SID of the SMS survey conversation that needs to be closed',
  },
];

exports.handler = prepareStudioFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const taskSid = event.taskSid;
  const customerRating = event.customerRating;
  const conversationSid = event.conversationSid;
  const surveyWorkflowSid = context.TWILIO_FLEX_SURVEY_WORKFLOW_SID;
  const surveyTaskChannel = context.TWILIO_FLEX_SURVEY_TASK_CHANNEL_SID;

  const taskRouterParameters = {
    context,
    workflowSid: surveyWorkflowSid,
    taskChannel: surveyTaskChannel,
    attributes: {
      conversations: {
        conversation_id: taskSid,
        conversation_measure_2: customerRating,
      },
    },
    timeout: 1,
  };

  const conversationParameters = {
    context,
    conversationSid,
    attributes: JSON.stringify({
      closeReason: 'autoIvrSurveyCloseFunction',
    }),
    state: 'closed',
  };

  try {
    // create a new survey task
    const taskRouterResult = await TaskrouterOperations.createTask(taskRouterParameters);

    // close the survey conversation once the survey is completed
    const conversationsResult = await ConversationOperations.updateAttributes(conversationParameters);

    response.setStatusCode(200);
    response.setBody({ taskRouterResult, conversationsResult });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
