(() => {
  const targetUrl = window.location.search.slice(1);
  const passwordPanel = document.getElementById('password-panel');
  const passwordField = document.getElementById('password-field');
  const passwordError = document.getElementById('password-error');
  const blockedSource = document.getElementById('blocked-source');

  // Function to get the source label based on the target URL
  const getBlockedSourceLabel = (url) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname === 'bit.ly' || parsedUrl.hostname.endsWith('.bit.ly')) {
        return 'Bitly ';
      }

      if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
        return 'YouTube ';
      }
    } catch (error) {
      // Keep the generic label if the target URL cannot be parsed.
    }

    return 'link';
  };

  blockedSource.textContent = getBlockedSourceLabel(targetUrl);

  // Function to set the bypassed flag and redirect to the target URL
  const continueToTarget = (totalBypassed) => {
    chrome.storage.local.set({
      bypassed: true,
      bypassedUrl: targetUrl,
      totalBypassed: (totalBypassed ?? 0) + 1
    }, () => {
      location.replace(targetUrl);
    });
  };

  // Get the current URL and title, and check against blocked IDs and title keywords
  const submitPassword = () => {
    chrome.storage.local.get(['password', 'totalBypassed'], (res) => {
      if (passwordField.value === res.password) {
        passwordError.textContent = '';
        continueToTarget(res.totalBypassed);
        return;
      }

      passwordError.textContent = 'Incorrect passcode. Please try again.';
      passwordField.value = '';
      passwordField.focus();
    });
  };

  // Show the password panel if the user has set a password
  const showPasswordPanel = () => {
    passwordPanel.hidden = false;
    passwordField.focus();
    passwordField.select();
  };

  // Go back to the previous page
  document.getElementById('back-btn').addEventListener('click', () => {
    window.close();
  });

  // Handle the continue button click
  document.getElementById('continue-btn').addEventListener('click', () => {
    chrome.storage.local.get(['requirePassword', 'password', 'totalBypassed'], (res) => {
      if (res.requirePassword && res.password != "") {
        showPasswordPanel();
        return;
      }

      continueToTarget(res.totalBypassed);
    });
  });

  // Handle the password field enter key
  passwordField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitPassword();
    }
  });
})();
