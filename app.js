/*
 * Demand strict-mode interpretation for this file.
 */
'use strict';

let viewport = document.getElementById('applicationView');
const loadApplication = () => {
    // This should include code that is useful for loading the remainder
    // of the application.
    let body = document.getElementsByTagName('body')[0];
    let splashScreen = document.createElement('div');
    let loadingText = document.createTextNode('Application is loading, please wait...');
    splashScreen.appendChild(loadApplication);
    body.appendChild(splashScreen);
};


