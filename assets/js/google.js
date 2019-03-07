const API_KEY = 'AIzaSyDpGTV4Vq6RY9kcedOky1PgLUH8V5nOwX4';
const APP_ID = 'clock-system';
const CLIENT_ID = '185676054251-j7dq1qkr6d0ohtdkjmsboda2tu3vgtdn.apps.googleusercontent.com';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file'
const DISCOVERY_DOCS = [
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
];

let GoogleAuth = null;
let pickerApiLoaded = false;
let oauthToken = null;

function updateSigninStatus(isSignedIn) {
    app.$data.authorized = isSignedIn;

    oauthToken = gapi.auth.getToken().access_token;
}

function setupClient() {
    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': DISCOVERY_DOCS
    }).then(function () {
        app.verifySpreadsheet();

        GoogleAuth = window.GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        // Initial sign-in state check
        updateSigninStatus(GoogleAuth.isSignedIn.get());
    });
};

function pickerLoaded() {
    pickerApiLoaded = true;
}

function pickFile() {
    if (!pickerApiLoaded || !oauthToken) {
        return;
    }

    return new Promise(resolve => {
        let view = new google.picker.View(google.picker.ViewId.DOCS);
        view.setMimeTypes('application/vnd.google-apps.spreadsheet');

        let picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            .setAppId(APP_ID)
            .setOAuthToken(oauthToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(API_KEY)
            .setCallback(result => {
                if (result.action === 'picked') {
                    resolve(result);
                }
            })
            .build();

        picker.setVisible(true);
    });
}

gapi.load('client', { callback: setupClient });
gapi.load('picker', { callback: pickerLoaded });