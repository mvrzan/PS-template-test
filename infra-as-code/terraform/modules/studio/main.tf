terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }
}

# FEATURE: remove-all

resource "twilio_studio_flows_v2" "chat" {
  friendly_name  = "Chat Flow"
  status         = "published"
  definition = templatefile("../../studio/chat-flow.json", local.params)
}

resource "twilio_studio_flows_v2" "messaging" {
  friendly_name  = "Messaging Flow"
  status         = "published"
  definition = templatefile("../../studio/messaging-flow.json", local.params)
}

resource "twilio_studio_flows_v2" "sms-survey" {
  friendly_name  = "sms-survey"
  status         = "published"
  definition = templatefile("../../studio/sms-survey.json", local.params)
}

resource "twilio_studio_flows_v2" "voice-survey" {
  friendly_name  = "voice-survey"
  status         = "published"
  definition = templatefile("../../studio/voice-survey.json", local.params)
}

resource "twilio_studio_flows_v2" "admin-phone-line" {
  friendly_name  = "admin-phone-line"
  status         = "published"
  definition = templatefile("../../studio/admin-phone-line.json", local.params)
}

resource "twilio_studio_flows_v2" "parent-calls" {
  friendly_name  = "parent-calls"
  status         = "published"
  definition = templatefile("../../studio/parent-calls.json", local.params)
}

resource "twilio_studio_flows_v2" "students-sms" {
  friendly_name  = "students-sms"
  status         = "published"
  definition = templatefile("../../studio/students-sms.json", local.params)
}

resource "twilio_studio_flows_v2" "student-calls" {
  friendly_name  = "student-calls"
  status         = "published"
  definition = templatefile("../../studio/student-calls.json", local.params)
}

# FEATURE: callback-and-voicemail
# FEATURE: schedule-manager
resource "twilio_studio_flows_v2" "voice" {
  friendly_name  = "Voice IVR"
  status         = "published"
  definition = templatefile("../../studio/voice-flow.json", local.params)
}
# END FEATURE: schedule-manager
# END FEATURE: callback-and-voicemail
# END FEATURE: remove-all

locals{
  params = {
    
# FEATURE: remove-all
    "WORKFLOW_SID_ASSIGN_TO_ANYONE" = var.workflow_sid_assign_to_anyone
    "WORKFLOW_SID_ASSIGN_TO_ANYONE_PROF" = var.workflow_sid_assign_to_anyone_prof
    "WORKFLOW_SID_DIRECT_SMS_MATCH_SUBJECT_GROUP" = var.workflow_sid_direct_sms_match_subject_group
    "WORKFLOW_SID_DIRECT_PHONE_MATCH_SUBJECT_GROUP" = var.workflow_sid_direct_phone_match_subject_group
    "SURVEY_TASK_AND_CONVERSATION_FUNCTION_SID" = var.function_survey_task_and_conversation_sid
    "SURVEY_TASK_FUNCTION_SID" = var.function_survey_task_sid
    "CLOSE_CONVERSATION_FUNCTION_SID" = var.function_close_conversation_sid
# END FEATURE: remove-all

    "SERVERLESS_DOMAIN" = var.serverless_domain
    "SERVERLESS_SID" = var.serverless_sid
    "SERVERLESS_ENV_SID" = var.serverless_env_sid
    
# FEATURE: schedule-manager
    "SCHEDULE_MANAGER_DOMAIN" = var.schedule_manager_domain
    "SCHEDULE_MANAGER_SID" = var.schedule_manager_sid
    "SCHEDULE_MANAGER_ENV_SID" = var.schedule_manager_env_sid
    "FUNCTION_CHECK_SCHEDULE_SID" = var.function_check_schedule_sid
# END FEATURE: schedule-manager

# FEATURE: callback-and-voicemail
    "FUNCTION_CREATE_CALLBACK" = var.function_create_callback
# END FEATURE: callback-and-voicemail

    "CHAT_CHANNEL_SID" = var.chat_channel_sid
    "VOICE_CHANNEL_SID" = var.voice_channel_sid
    "SMS_CHANNEL_SID" = var.sms_channel_sid
  }
}
