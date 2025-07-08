(() => {
  document.getElementById('back-btn').addEventListener('click', () => {
    window.close();
  });

  document.getElementById('continue-btn').addEventListener('click', () => {
    // Get settings from local storage
    chrome.storage.local.get(['requirePassword', 'password', 'totalBypassed'], (res) => {
      if (res.requirePassword && res.password != "") {
        const passcode = window.prompt("Please enter a passcode:");
        
        // Check if passcode is correct
        if (passcode === res.password) {
          chrome.storage.local.set({ "bypassed": true });
          location.replace(window.location.search.slice(1));
          chrome.storage.local.set({ totalBypassed: (res.totalBypassed ?? 0) + 1 })
        } else if (passcode != null) {
          alert("Incorrect passcode. Please try again.");
        }
      } else {
        chrome.storage.local.set({ "bypassed": true });
        location.replace(window.location.search.slice(1));
        chrome.storage.local.set({ totalBypassed: (res.totalBypassed ?? 0) + 1 })
      }
    });
  });
})();
