const API_KEY = 'AIzaSyDpGTV4Vq6RY9kcedOky1PgLUH8V5nOwX4';
const CLIENT_ID = '185676054251-j7dq1qkr6d0ohtdkjmsboda2tu3vgtdn.apps.googleusercontent.com';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
const DISCOVERY_DOCS = [
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
];

let GoogleAuth = null;

function updateSigninStatus(isSignedIn) {
    app.$data.authorized = isSignedIn;
}

function start() {
    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': DISCOVERY_DOCS
    }).then(function () {
        GoogleAuth = window.GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        // Initial sign-in state check
        updateSigninStatus(GoogleAuth.isSignedIn.get())
    });
};

gapi.load('client', start);