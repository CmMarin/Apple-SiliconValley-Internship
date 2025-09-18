from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import os

# Load Google Calendar credentials from environment variables or a config file
def get_calendar_service():
    creds = service_account.Credentials.from_service_account_file(
        os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    )
    service = build('calendar', 'v3', credentials=creds)
    return service

# Function to create an event in Google Calendar
def create_event(event_details):
    service = get_calendar_service()
    
    event = {
        'summary': event_details['task'],
        'start': {
            'dateTime': event_details.get('time', datetime.utcnow().isoformat() + 'Z'),
            'timeZone': 'UTC',
        },
        'end': {
            'dateTime': event_details.get('end_time', (datetime.utcnow() + timedelta(hours=1)).isoformat() + 'Z'),
            'timeZone': 'UTC',
        },
        'reminders': {
            'useDefault': False,
            'overrides': [
                {'method': 'email', 'minutes': 10},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    return event

# Function to list events from Google Calendar
def list_events():
    service = get_calendar_service()
    now = datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    events_result = service.events().list(calendarId='primary', timeMin=now,
                                          maxResults=10, singleEvents=True,
                                          orderBy='startTime').execute()
    events = events_result.get('items', [])
    return events