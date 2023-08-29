/* globals zoomSdk */

const invokeZoomAppsSdk = api => () => {
  const { name, buttonName = '', options = null } = api
  const zoomAppsSdkApi = zoomSdk[name].bind(zoomSdk)

  zoomAppsSdkApi(options)
    .then(clientResponse => {
      console.log(`${buttonName || name} success with response: ${JSON.stringify(clientResponse)}`);
    })
    .catch(clientError => {
      console.log(`${buttonName || name} error: ${JSON.stringify(clientError)}`);
    });
}

const sortListByName = (curr, next) => {
  const currName = curr.name.toLowerCase();
  const nextName = next.name.toLowerCase();
  if (currName < nextName) { return -1; }
  if (currName > nextName) { return 1; }
  return 0;
}

// New apis are constantly created and may not be included here
// Please visit the Zoom Apps developer docs for comprehensive list
const apis = [
  {
    name: 'getSupportedJsApis'
  },
  {
    name: 'openUrl',
    options: { url: "https://www.google.com/" }
  },
  {
    name: 'getMeetingContext'
  },
  {
    name: 'getRunningContext'
  },
  {
    name: 'showNotification',
    options: {
      type: "info",
      title: "Hello Zoom Apps",
      message: "Testing notification",
    }
  },
  {
    name: 'sendAppInvitationToAllParticipants'
  },
  {
    name: 'sendAppInvitationToMeetingOwner'
  },
  {
    name: 'showAppInvitationDialog'
  },
  {
    name: 'getMeetingParticipants'
  },
  {
    name: 'getMeetingUUID'
  },
  {
    name: 'getMeetingJoinUrl'
  },
  {
    name: 'expandApp'
  },
  {
    name: 'allowParticipantToRecord'
  },
  {
    name: 'getRecordingContext'
  },
  {
    buttonName: 'cloudRecording (start)',
    name: 'cloudRecording',
    options: { action: 'start' }
  },
  {
    buttonName: 'cloudRecording (stop)',
    name: 'cloudRecording',
    options: { action: 'stop' }
  },
  {
    buttonName: 'cloudRecording (pause)',
    name: 'cloudRecording',
    options: { action: 'pause' }
  },
  {
    buttonName: 'cloudRecording (resume)',
    name: 'cloudRecording',
    options: { action: 'resume' }
  },
  {
    buttonName: 'shareApp (start)',
    name: 'shareApp',
    options: {
      action: 'start'
    }
  },
  {
    buttonName: 'shareApp (stop)',
    name: 'shareApp',
    options: {
      action: 'stop'
    }
  },
].sort(sortListByName);

module.exports = { apis, invokeZoomAppsSdk }
