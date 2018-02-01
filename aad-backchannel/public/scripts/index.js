var current_user = null;
var current_access_token = null;

var msalconfig = {
    clientID: "7fcc1764-0747-458f-9ef4-0913a2a1eacc",
    redirectUri: location.origin
};

var graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";
var graphAPIScopes = ["https://graph.microsoft.com/user.read"];
var userAgentApplication = new Msal.UserAgentApplication(msalconfig.clientID, null, loginCallback, {
    redirectUri: msalconfig.redirectUri
});

if (userAgentApplication.redirectUri) {
    userAgentApplication.redirectUri = msalconfig.redirectUri;
}

window.onload = function () {
    if (!userAgentApplication.isCallback(window.location.hash) && window.parent === window && !window.opener) {
        var user = userAgentApplication.getUser();
        if (user) {
            callGraphApi();
        }
    }
}

function callGraphApi() {
    var user = userAgentApplication.getUser();
    if (!user) {
        userAgentApplication.loginRedirect(graphAPIScopes);
    } else {
        
        document.getElementById("signOutButton").classList.remove("hidden");

        var userInfoElement = document.getElementById("userInfo");
        userInfoElement.parentElement.classList.remove("hidden");
        userInfoElement.innerHTML = JSON.stringify(user, null, 4);
        current_user = user;

        userAgentApplication.acquireTokenSilent(graphAPIScopes)
            .then(function (token) {
                
                var tokenElement = document.getElementById("accessToken");
                tokenElement.parentElement.classList.remove("hidden");
                tokenElement.innerHTML = token;
                current_access_token = token;

                document.getElementById("BotChatGoesHere").classList.remove("hidden");
                loadBot(current_access_token);

            }, function (error) {
                if (error) {
                    userAgentApplication.acquireTokenRedirect(graphAPIScopes);
                }
            });
    }
}

/**
 * Show an error message in the page
 * @param {string} endpoint - the endpoint used for the error message
 * @param {string} error - the error string
 * @param {object} errorElement - the HTML element in the page to display the error
 */
function showError(endpoint, error, errorDesc) {
    var formattedError = JSON.stringify(error, null, 4);
    if (formattedError.length < 3) {
        formattedError = error;
    }
    document.getElementById("errorMessage").innerHTML = "An error has occurred:<br/>Endpoint: " + endpoint + "<br/>Error: " + formattedError + "<br/>" + errorDesc;
    console.error(error);
}

/**
 * Callback method from sign-in: if no errors, call callGraphApi() to show results.
 * @param {string} errorDesc - If error occur, the error message
 * @param {object} token - The token received from login
 * @param {object} error - The error 
 * @param {string} tokenType - The token type: For loginRedirect, tokenType = "id_token". For acquireTokenRedirect, tokenType:"access_token"
 */
function loginCallback(errorDesc, token, error, tokenType) {
    if (errorDesc) {
        showError(msal.authority, error, errorDesc);
    } else {
        callGraphApi();
    }
}

function signOut() {
    userAgentApplication.logout();
}