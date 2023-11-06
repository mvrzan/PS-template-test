exports.handler = async function closeConversation(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  const client = context.getTwilioClient();
  const conversationSid = event.conversation_sid;
  const updateObject = {
    state: 'closed',
    attributes: JSON.stringify({
      closeReason: 'autoIvrCloseFunction',
    }),
  };

  try {
    const result = await client.conversations.v1.conversations(conversationSid).update(updateObject);

    response.appendHeader('Content-Type', 'application/json');
    response.setStatusCode(200);
    response.setBody(result);

    return callback(null, response);
  } catch (error) {
    console.error(`There was an error when closing the Conversation ${conversationSid}:`, error);

    response.appendHeader('Content-Type', 'plain/text');
    response.setStatusCode(500);
    response.setBody(error.message);

    return callback(null, response);
  }
};
