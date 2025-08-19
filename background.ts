import { Omni } from './src/Omni';

console.log("Background script loaded");

// We need to figure out how to handle localStorage persistence.
// For now, we'll just assume not authorized.
const omni = new Omni(false);

chrome.omnibox.onInputStarted.addListener(() => {
  console.log("Omnibox input started");
  // The original had a check here to prompt for authorization.
  // We will need to decide how to handle this in the new architecture.
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log("Omnibox input changed:", text);
  omni.suggest(text, suggest);
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  console.log("Omnibox input entered:", text);
  if (text) {
    omni.decide(text);
  }
});

// The original also had a message listener. We'll need to migrate this as well.
chrome.runtime.onMessage.addListener((message) => {
    switch (message) {
        case 'authorize':
            omni.authorize();
            break;
        // ... other cases
    }
});
