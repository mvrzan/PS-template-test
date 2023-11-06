---
sidebar_label: sms-surveys
title: sms-surveys
---

The _SMS Survey_ Twilio Flex plugin enhances your Twilio Flex customer experience with a SMS survey.

# Flex User and Customer Experience

The plugin is seamless for Flex users as the plugin will send a dedicated SMS survey message and invoke a dedicated SMS survey Studio Flow.

# Setup and dependencies

In order for this plugin to work, there are several items that have to be in place:

1. SMS Survey Studio Flow
2. Survey TaskRouter Setup
3. TwiML App

## Survey Studio Flow

The first step in the configuration process is to create a Studio Flow that is dedicated to the SMS survey experience. An example of this can be found [here](/plugin-flex-ts-template-v2/src/feature-library/sms-surveys/helpers/sms-survey-flow-example.json).

## Survey TaskRouter Setup

TaskRouter is required to insert the survey results into Flex Insights. The next step is to configure a Task Queue, Workflow, and Task Type.

### TaskQueue

In the Twilio Console, navigate to TaskRouter, open the Flex Workspace, and select TaskQueue. Create a new TaskQueue named “Survey” and set the expression to 1 == 0. This will create a queue with no members. This queue will not route live tasks; it will only be used to insert the survey results into Flex Insights.

### Workflow

Once the TaskQueue has been created, select Workflows to create a new workflow. Name the new workflow “Survey”, set the timeout to 3 seconds, and create an expression that routes to the new “Survey” queue.

### TaskChannel

The last step under TaskRouter is to create a new Task Channel. Select the TaskChannel section and create a new channel with the name “Survey”.

## TwiML App

In order to configure your TwiML App, follow this [guide](https://www.twilio.com/docs/voice/twiml/dial/application-usage#configure-your-twiml-app-in-the-console) and use the survey Studio Flow webhook as the `Request URL`.

# How does it work?

With the help of [Flex Action Framework](https://www.twilio.com/docs/flex/developer/ui/v1/actions), an event listener has been registered on a [Flex WraupTask Action](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.0/ui-actions/Actions/#WrapupTask). This means that after an agent ends the SMS task, the event listener will automatically call the `transferUtil.transferToSurvey()` utility.

This specific utility will then send a request to a Twilio Serverless Function called `sms-survey-transfer` which will do the following:

1. it will accept details form the transfer utility
2. create a new conversation
3. attach a studio webhook to the newly created conversation
4. add the customer and the Twilio SMS survey phone number into the conversation
5. add a message into the conversation to trigger an outbound SMS to the customer
6. SMS Survey Studio Flow execution will start

In the studio flow invoke a new serverless function that does the following:
create a new survey task and link it to the original SMS task for flex insights and send it to the survey workflow
close the conversation so a new sms survey can be created in the future

## What happens after the transfer to the survey Studio Flow?

Once the survey in the designated survey Studio Flow has started, the customer will be asked if they are happy with the service or not and will press the DTMF depending on their experience. Please note that this is just a sample experience and that it can be customized as needed.

In the survey Studio Flow, there is a serverless function that does the following:

1. create a new survey task and link it to the original SMS task for Flex Insights and sends it to the survey workflow
2. close the conversation so a new sms survey can be created in the future

### Why are we creating a second task?

The second task has a custom attribute:

```
attributes: {
      conversations: {
        conversation_id: taskSid,
        conversation_measure_2: customerRating,
      },
    },
```

This custom attribute is what is needed for [Flex Insights](https://www.twilio.com/docs/flex/developer/insights/enhance-integration#link-tasks-to-a-conversation) to link survey tasks with the original task. The survey results are stored in the `conversation_measure_2` attribute.
