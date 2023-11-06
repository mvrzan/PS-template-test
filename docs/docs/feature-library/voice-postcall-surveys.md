---
sidebar_label: voice-postcall-surveys
title: voice-postcall-surveys
---

The _Voice Post-call Survey_ Twilio Flex plugin enhances your Twilio Flex customer experience with a post-call voice survey.

# Flex User and Customer Experience

The plugin is seamless for Flex users as the plugin will automatically route the caller to a dedicated phone survey Studio Flow.

# Setup and dependencies

In order for this plugin to work, there are several items that have to be in place:

1. Survey Studio Flow
2. Survey TaskRouter Setup
3. TwiML App

## Survey Studio Flow

The first step in the configuration process is to create a Studio Flow that is dedicated to the post-call survey experience. An example of this can be found [here](/plugin-flex-ts-template-v2/src/feature-library/voice-postcall-surveys/helpers/voice-survey-flow.json).

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

With the help of [Flex Action Framework](https://www.twilio.com/docs/flex/developer/ui/v1/actions), an event listener has been registered on a [Flex HangUp Action](https://assets.flex.twilio.com/docs/releases/flex-ui/2.4.0/ui-actions/Actions/#HangupCall). This means that after an agent ends the call, the event listener will automatically call the `transferUtil.transferToSurvey()` utility.

This specific utility will then send a request to a Twilio Serverless Function called `survey-transfer` which will then end the current call and transfer the caller to a new Studio Flow that is associated with a survey experience.

## How does the serverless function transfer the call?

The `survey-transfer` Twilio Serverless Function uses [TwiML](https://www.twilio.com/docs/voice/twiml). TwiML (the Twilio Markup Language) is a set of instructions you can use to tell Twilio what to do when you receive an incoming call or SMS.

Specifically for this use case, it uses the `<Dial>` verb with the `<Application>` noun as documented [here](https://www.twilio.com/docs/voice/twiml/dial/application).

## What does this `<Application>` do?

The [`<Application>`](https://www.twilio.com/docs/voice/twiml/dial/application-usage) allows you to connect a call to another application without losing the original call leg's context. Since we have a designated Studio Flow for the voice call surveys, the `<Application>` is pointing to a Twilio Studio Flow webhook.

This setup is what allows the `survey-transfer` function to leverage the `<Application>`, pass some custom parameters, and then transfer the call to the designated Studio Flow via its webhook.

## What happens after the transfer to the survey Studio Flow?

Once the call has been successfully transferred to the designated survey Studio Flow, the caller will be asked if they are happy with the service or not and will press the DTMF depending on their experience. Please note that this is just a sample experience and that it can be customized as needed.

## The final part of the solution

There is one more Twilio Serverless Function in this solution that is part of the survey Studio Flow and it's called `survey-task-update`. This function will take in the custom parameters from the `<Application>` and use them to create a new Task that will be sent to the Survey TaskChannel and Workflow.

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
