const { isString, isObject, isNumber, isArray } = require('lodash');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be fetched
 * @returns {object} An object containing the conversation
 * @description the following method is used to get a conversation
 */
exports.getConversation = async function getConversation(parameters) {
  const { context, conversationSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');

  try {
    const client = context.getTwilioClient();

    const conversation = await client.conversations.v1.conversations(conversationSid).fetch();

    return { success: true, status: 200, conversation };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateAttributes);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the sid for this conversation
 * @param {number} parameters.limit max number of participants to list
 * @returns {object} An object containing an array of participants
 * @description the following method is used to list conversation participants
 */
exports.participantList = async function participantList(parameters) {
  const { context, conversationSid, limit } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string value');
  if (!isNumber(limit)) throw new Error('Invalid parameters object passed. Parameters must contain limit number value');

  try {
    const client = context.getTwilioClient();
    const participants = await client.conversations.v1.conversations(conversationSid).participants.list({ limit });

    return { success: true, status: 200, participants };
  } catch (error) {
    return retryHandler(error, parameters, exports.participantList);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be updated
 * @param {object} parameters.attributes the attributes to apply to the channel
 * @returns {object} An object containing the updated conversation
 * @description the following method is used to apply attributes
 *    to the conversation object
 */
exports.updateAttributes = async function updateAttributes(parameters) {
  const { context, conversationSid, attributes, state = undefined } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');
  if (!isString(attributes))
    throw new Error('Invalid parameters object passed. Parameters must contain attributes string');

  try {
    const client = context.getTwilioClient();
    let conversation;

    if (state) {
      const updatedAttributes = {
        state,
        attributes,
      };

      conversation = await client.conversations.v1.conversations(conversationSid).update(updatedAttributes);
    } else {
      conversation = await client.conversations.v1.conversations(conversationSid).update({ attributes });
    }

    return { success: true, status: 200, conversation };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateAttributes);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be updated
 * @param {object} parameters.method webhook method
 * @param {array} parameters.filters webhook filters
 * @param {object} parameters.url webhook url
 * @param {object} parameters.target webhook target type
 * @returns {object} An object containing the webhook
 * @description the following method is used to add a webhook
 *    to the conversation object
 */
exports.addWebhook = async function addWebhook(parameters) {
  const { context, conversationSid, method, filters, url, target } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');
  if (!isString(method)) throw new Error('Invalid parameters object passed. Parameters must contain method string');
  if (!isArray(filters)) throw new Error('Invalid parameters object passed. Parameters must contain filters array');
  if (!isString(url)) throw new Error('Invalid parameters object passed. Parameters must contain url string');
  if (!isString(target)) throw new Error('Invalid parameters object passed. Parameters must contain target string');

  try {
    const client = context.getTwilioClient();

    const webhook = await client.conversations.v1.conversations(conversationSid).webhooks.create({
      'configuration.method': method,
      'configuration.filters': filters,
      'configuration.url': url,
      target,
    });

    return { success: true, status: 200, webhook };
  } catch (error) {
    return retryHandler(error, parameters, exports.addWebhook);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be updated
 * @param {object} parameters.webhookSid webhook sid
 * @returns {object} An object containing the conversation
 * @description the following method is used to remove a webhook
 *    from the conversation object
 */
exports.removeWebhook = async function removeWebhook(parameters) {
  const { context, conversationSid, webhookSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');
  if (!isString(webhookSid))
    throw new Error('Invalid parameters object passed. Parameters must contain webhookSid string');

  try {
    const client = context.getTwilioClient();

    const webhook = await client.conversations.v1.conversations(conversationSid).webhooks(webhookSid).remove();

    return { success: true, status: 200, webhook };
  } catch (error) {
    return retryHandler(error, parameters, exports.removeWebhook);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.attributes the attributes to apply to the conversation
 * @returns {object} An object containing the conversation
 * @description the following method is used to create a new conversation
 */
exports.createConversation = async function createConversation(parameters) {
  const { context, attributes } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(attributes))
    throw new Error('Invalid parameters object passed. Parameters must contain attributes string');

  try {
    const client = context.getTwilioClient();

    const conversation = await client.conversations.v1.conversations.create({
      attributes,
    });

    return { success: true, status: 200, conversation };
  } catch (error) {
    return retryHandler(error, parameters, exports.createConversation);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be updated
 * @param {string} parameters.target webhook target type
 * @param {string} parameters.surveyFlowSid studio flow sid
 * @returns {object} An object containing the webhook
 * @description the following method is used to add a studio webhook
 *    to the conversation object
 */
exports.addStudioWebhook = async function addStudioWebhook(parameters) {
  const { context, conversationSid, target, surveyFlowSid } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');
  if (!isString(target)) throw new Error('Invalid parameters object passed. Parameters must contain target string');
  if (!isString(surveyFlowSid))
    throw new Error('Invalid parameters object passed. Parameters must contain survey flow sid string');

  try {
    const client = context.getTwilioClient();

    const webhook = await client.conversations.v1.conversations(conversationSid).webhooks.create({
      target,
      'configuration.flowSid': surveyFlowSid,
    });

    return { success: true, status: 200, webhook };
  } catch (error) {
    return retryHandler(error, parameters, exports.addStudioWebhook);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be updated
 * @param {string} parameters.customerAddress customer phone number
 * @param {string} parameters.surveySmsPhoneNumber sms survey phone number
 * @returns {object} An object containing the webhook
 * @description the following method is used to add participants into the conversation
 */
exports.addParticipants = async function addParticipants(parameters) {
  const { context, conversationSid, customerAddress, surveySmsPhoneNumber } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');
  if (!isString(customerAddress))
    throw new Error('Invalid parameters object passed. Parameters must contain customer address string');
  if (!isString(surveySmsPhoneNumber))
    throw new Error('Invalid parameters object passed. Parameters must contain survey sms phone number string');

  try {
    const client = context.getTwilioClient();

    const participants = await client.conversations.v1.conversations(conversationSid).participants.create({
      'messagingBinding.address': customerAddress,
      'messagingBinding.proxyAddress': surveySmsPhoneNumber,
    });

    return { success: true, status: 200, participants };
  } catch (error) {
    return retryHandler(error, parameters, exports.addParticipants);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conversationSid the conversation to be updated
 * @param {string} parameters.author author of the sent message
 * @param {string} parameters.body sms message body
 * @returns {object} An object containing the webhook
 * @description the following method is used to send a message into the conversation
 */
exports.sendMessage = async function sendMessage(parameters) {
  const { context, conversationSid, author, body } = parameters;

  if (!isObject(context)) throw new Error('Invalid parameters object passed. Parameters must contain context object');
  if (!isString(conversationSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conversationSid string');
  if (!isString(author)) throw new Error('Invalid parameters object passed. Parameters must contain author string');
  if (!isString(body)) throw new Error('Invalid parameters object passed. Parameters must contain message body string');

  try {
    const client = context.getTwilioClient();

    const message = await client.conversations.v1.conversations(conversationSid).messages.create({
      author,
      body,
      xTwilioWebhookEnabled: true,
    });

    return { success: true, status: 200, message };
  } catch (error) {
    return retryHandler(error, parameters, exports.sendMessage);
  }
};
