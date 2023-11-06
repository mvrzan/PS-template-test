
# FEATURE: remove-all
resource "twilio_taskrouter_workspaces_workflows_v1" "assign_to_anyone" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Assign to Anyone"
  configuration = templatefile("../../taskrouter/assign_to_anyone.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "assign_to_anyone_prof" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Assign to Anyone Prof"
  configuration = templatefile("../../taskrouter/assign_to_anyone_prof.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "direct_phone_match_subject_group" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "direct - phone - match subject_group"
  configuration = templatefile("../../taskrouter/direct_phone_match_subject_group.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "direct_sms_match_subject_group" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "direct - sms - match subject_group"
  configuration = templatefile("../../taskrouter/direct_sms_match_subject_group.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "textback_sms_match_specific_worker" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "textback - sms - match specific worker"
  configuration = templatefile("../../taskrouter/textback_sms_match_specific_worker.json.json", local.params)
}

resource "twilio_taskrouter_workspaces_workflows_v1" "surveys" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Surveys"
  configuration = templatefile("../../taskrouter/surveys.json", local.params)
}
# END FEATURE: remove-all

# FEATURE: callback-and-voicemail
resource "twilio_taskrouter_workspaces_workflows_v1" "callback" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Callback"
  configuration = templatefile("../../taskrouter/callback.json", local.params)
}
# END FEATURE: callback-and-voicemail

# FEATURE: conversation-transfer
resource "twilio_taskrouter_workspaces_workflows_v1" "chat_transfer" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Chat Transfer"
  configuration = templatefile("../../taskrouter/chat_transfer.json", local.params)
}
# END FEATURE: conversation-transfer

# FEATURE: internal-call
resource "twilio_taskrouter_workspaces_workflows_v1" "internal_call" {
  workspace_sid = twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name = "Internal Call"
  configuration = templatefile("../../taskrouter/internal_call.json", local.params)
}
# END FEATURE: internal-call

locals{
  params = {

# FEATURE: remove-all
    "QUEUE_SID_EVERYONE" = twilio_taskrouter_workspaces_task_queues_v1.everyone.sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SALES" = twilio_taskrouter_workspaces_task_queues_v1.template_example_sales.sid
    "QUEUE_SID_TEMPLATE_EXAMPLE_SUPPORT" = twilio_taskrouter_workspaces_task_queues_v1.template_example_support.sid
    "QUEUE_SID_SURVEY" = twilio_taskrouter_workspaces_task_queues_v1.survey.sid
    "QUEUE_SID_PROFS" = twilio_taskrouter_workspaces_task_queues_v1.profs.sid
# END FEATURE: remove-all

# FEATURE: internal-call
    "QUEUE_SID_INTERNAL_CALLS" = twilio_taskrouter_workspaces_task_queues_v1.internal_calls.sid
# END FEATURE: internal-call

  }
}
