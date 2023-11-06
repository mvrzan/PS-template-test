resource "twilio_taskrouter_workspaces_task_channels_v1" "voice" {
  workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name	= "Voice"
  unique_name = "voice"
}

resource "twilio_taskrouter_workspaces_task_channels_v1" "chat" {
  workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name	= "Chat"
  unique_name = "chat"
}

resource "twilio_taskrouter_workspaces_task_channels_v1" "survey" {
  workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name	= "Survey"
  unique_name = "survey"
}

resource "twilio_taskrouter_workspaces_task_channels_v1" "sms" {
  workspace_sid	= twilio_taskrouter_workspaces_v1.flex.sid
  friendly_name	= "SMS"
  unique_name = "sms"
}

