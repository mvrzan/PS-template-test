provider "twilio" {
  account_sid = var.TWILIO_ACCOUNT_SID
  username     = var.TWILIO_API_KEY
  password  = var.TWILIO_API_SECRET
}

terraform {
  required_providers {
    twilio = {
      source  = "twilio/twilio"
      version = ">=0.4.0"
    }
  }

  required_version = ">= 1.1.0"

  backend "local" {}
}

module "studio" {
  source           = "../../modules/studio"

# FEATURE: remove-all
  workflow_sid_assign_to_anyone = module.taskrouter.workflow_sid_assign_to_anyone
  workflow_sid_assign_to_anyone_prof = module.taskrouter.workflow_sid_assign_to_anyone_prof
  workflow_sid_direct_sms_match_subject_group = module.taskrouter.workflow_sid_direct_sms_match_subject_group
  workflow_sid_direct_phone_match_subject_group = module.taskrouter.workflow_sid_direct_phone_match_subject_group
  function_survey_task_and_conversation_sid = var.SURVEY_TASK_AND_CONVERSATION_FUNCTION_SID
  function_survey_task_sid = var.SURVEY_TASK_FUNCTION_SID
  function_close_conversation_sid = var.CLOSE_CONVERSATION_FUNCTION_SID
# END FEATURE: remove-all

# FEATURE: conversation-transfer
  workflow_sid_chat_transfer = module.taskrouter.workflow_sid_chat_transfer
# END FEATURE: conversation-transfer

# FEATURE: callback-and-voicemail
  workflow_sid_callback = module.taskrouter.workflow_sid_callback
# END FEATURE: callback-and-voicemail

# FEATURE: internal-call
  workflow_sid_internal_call = module.taskrouter.workflow_sid_internal_call
# END FEATURE: internal-call

  chat_channel_sid = module.taskrouter.chat_channel_sid
  voice_channel_sid = module.taskrouter.voice_channel_sid
  sms_channel_sid = module.taskrouter.sms_channel_sid
  serverless_domain = var.SERVERLESS_DOMAIN
  serverless_sid = var.SERVERLESS_SID
  serverless_env_sid = var.SERVERLESS_ENV_SID

# FEATURE: schedule-manager
  schedule_manager_domain = var.SCHEDULE_MANAGER_DOMAIN
  schedule_manager_sid = var.SCHEDULE_MANAGER_SID
  schedule_manager_env_sid = var.SCHEDULE_MANAGER_ENV_SID
  function_check_schedule_sid = var.SCHEDULE_MANAGER_CHECK_FUNCTION_SID
# END FEATURE: schedule-manager

# FEATURE: callback-and-voicemail
  function_create_callback = var.SERVERLESS_CALLBACK_FUNCTION_SID
# END FEATURE: callback-and-voicemail 

}

module "taskrouter" {
  source           = "../../modules/taskrouter"
}
