document.addEventListener('DOMContentLoaded', () => {
  const toggleExtension = document.getElementById('toggle-extension');
  const totalRickrolls = document.getElementById('total-rickrolls');
  const totalBypassed = document.getElementById('total-bypassed');
  const blockedIdsContainer = document.getElementById('blocked-ids-container');
  const newIdInput = document.getElementById('new-id');
  const addIdBtn = document.getElementById('add-id-btn');
  const requirePasswordCheckbox = document.getElementById('require-password');
  const blockTitleKeywordsCheckbox = document.getElementById('block-title-keywords');
  const passwordInput = document.getElementById('password-input');
  const savePasswordBtn = document.getElementById('save-password-btn');
  const closeBtn = document.getElementById('close-btn');
  const copyRandomBtn = document.getElementById('copy-random-btn');
  const reportRickrollBtn = document.getElementById('report-rickroll-btn');
  const reportMessage = document.getElementById('report-message');
  const mostVisitedList = document.getElementById('most-visited-urls');

  // Function to update the extension badge based on the current settings
  function updateBadge(extDisabled, blockTitleKeywords) {
    if (extDisabled) {
      chrome.action.setBadgeBackgroundColor({ color: '#e65046' });
      chrome.action.setBadgeText({ text: 'off' });
      return;
    }

    if (blockTitleKeywords) {
      chrome.action.setBadgeBackgroundColor({ color: '#78b354' });
      chrome.action.setBadgeText({ text: 'all' });
      return;
    }

    chrome.action.setBadgeBackgroundColor({ color: '#888888' });
    chrome.action.setBadgeText({ text: '' });
  }

  // Default list of blocked IDs (can be modified by the user)
  const defaultBlockedIds = [
    "dQw4w9WgXcQ",
    "34Ig3X59_qA",
    "xm3YgoEiEDc",
    "zL19uMsnpSU",
    "rTgj1HxmUbg",
    "o-YBDTqX_ZU",
    "AyOqGRjVtls",
    "5lUYJpoNt4g",
    "LLFhKaqnWwk",
    "hvL1339luv0",
    "EpX1_YJPGAY",
    "xdcXNHyE6Cg",
    "f-tLr7vONmc",
    "cvh0nX08nRw",
    "ORuTA9a_YVo",
    "DSG53BsUYd0"
  ];

  // Initialize storage with default blocked IDs if not already set
  chrome.storage.local.get(['blockedIds'], (res) => {
    if (!res.blockedIds) {
      chrome.storage.local.set({ blockedIds: defaultBlockedIds }, () => {
        updateBlockedIds(defaultBlockedIds);
      });
    } else {
      updateBlockedIds(res.blockedIds);
    }
  });

  // Load the current state from storage
  chrome.storage.local.get(['extDisabled', 'totalRickRolls', 'requirePassword', 'blockTitleKeywords', 'password', 'totalBypassed', 'mostVisited'], (res) => {
    toggleExtension.checked = !res.extDisabled;
    totalRickrolls.textContent = res.totalRickRolls ?? 0;
    totalBypassed.textContent = res.totalBypassed ?? 0;
    requirePasswordCheckbox.checked = res.requirePassword ?? false;
    blockTitleKeywordsCheckbox.checked = res.blockTitleKeywords ?? false;
    passwordInput.value = res.password ?? '';
    passwordInput.type = passwordInput.value ? 'password' : 'text';
    const mostVisited = res.mostVisited ?? {};
    const urlCounts = mostVisited.reduce((acc, url) => {
      acc[url] = (acc[url] || 0) + 1;
      return acc;
    }, {});
    const sortedUrls = Object.entries(urlCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    mostVisitedList.innerHTML = sortedUrls.map(([url, count]) => `<li>${url}(${count}x)</li>`).join('');
    updateBadge(res.extDisabled ?? false, res.blockTitleKeywords ?? false);
  });

  // Add event listener for the toggle
  toggleExtension.addEventListener('change', () => {
    const extDisabled = !toggleExtension.checked;
    chrome.storage.local.set({ extDisabled });
    updateBadge(extDisabled, blockTitleKeywordsCheckbox.checked);
  });

  // Add event listener for requiring password
  requirePasswordCheckbox.addEventListener('change', () => {
    const requirePassword = requirePasswordCheckbox.checked;
    chrome.storage.local.set({ requirePassword });
  });

  // Add event listener for title keyword blocking
  blockTitleKeywordsCheckbox.addEventListener('change', () => {
    const blockTitleKeywords = blockTitleKeywordsCheckbox.checked;
    chrome.storage.local.set({ blockTitleKeywords });
    updateBadge(!toggleExtension.checked, blockTitleKeywords);
  });

  // Add event listener for saving password
  savePasswordBtn.addEventListener('click', () => {
    const password = passwordInput.value;
    chrome.storage.local.set({ password }, () => {
      passwordInput.type = password ? 'password' : 'text';
    });
  });

  // Add event listener to update input type based on value
  passwordInput.addEventListener('input', () => {
    if (passwordInput.value === "") {
      passwordInput.type = 'text';
    }
  });

  // Add event listener for closing the popup
  closeBtn.addEventListener('click', () => {
    window.close();
  });

  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.content');

  // Add event listeners for tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const target = this.getAttribute('data-tab');
      contents.forEach(content => {
        if (content.classList.contains(target)) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  // Activate the home tab by default
  document.querySelector('.tab[data-tab="home"]').click();

  // Add event listener for adding new IDs
  addIdBtn.addEventListener('click', () => {
    const newId = newIdInput.value.trim();
    if (newId) {
      chrome.storage.local.get(['blockedIds'], (res) => {
        const blockedIds = res.blockedIds ?? [];
        if (!blockedIds.includes(newId)) {
          blockedIds.push(newId);
          chrome.storage.local.set({ blockedIds }, () => {
            updateBlockedIds(blockedIds);
            newIdInput.value = '';
          });
        }
      });
    }
  });

  // Report the current URL as a rickroll and save it to the batabase
  reportRickrollBtn.addEventListener('click', () => {
    // Get the current tab URL and apply regex matching
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0].url;
      console.log(currentUrl)
      const youtubeRegex = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = currentUrl.match(youtubeRegex);

      // Save the video ID if possible and display a message
      if (match && match[1]) {
        const videoId = match[1];
        chrome.storage.local.get(['blockedIds'], (res) => {
          const blockedIds = res.blockedIds ?? [];
          if (!blockedIds.includes(videoId)) {
            blockedIds.push(videoId);
            chrome.storage.local.set({ blockedIds }, () => {
              updateBlockedIds(blockedIds);
              reportMessage.textContent = 'Saved to Database!';
              reportMessage.style.color = '#78b354';
            });
          } else {
            reportMessage.textContent = 'Link already in list';
            reportMessage.style.color = '#f2b818';
          }
        });
      } else {
        reportMessage.textContent = 'Invalid YouTube link';
        reportMessage.style.color = '#e63c1e';
      }

      // Clear the message after a two seconds
      setTimeout(() => {
        reportMessage.textContent = '';
      }, 2000);
    });
  });

  // Change dice icon randomly and ensure it doesn't choose the same icon twice
  const diceIcons = ['bi-dice-1', 'bi-dice-2', 'bi-dice-3', 'bi-dice-4', 'bi-dice-5', 'bi-dice-6'];
  let lastDiceIndex = -1;

  function getRandomDiceIcon() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * diceIcons.length);
    } while (randomIndex === lastDiceIndex);

    lastDiceIndex = randomIndex;
    return diceIcons[randomIndex];
  }

  // Add event listener for copying random link
  copyRandomBtn.addEventListener('click', () => {
    chrome.storage.local.get(['blockedIds'], (res) => {
      const blockedIds = res.blockedIds ?? [];
      if (blockedIds.length > 0) {
        const randomId = blockedIds[Math.floor(Math.random() * blockedIds.length)];
        const randomLink = `https://www.youtube.com/watch?v=${randomId}`;
        navigator.clipboard.writeText(randomLink).then(() => {
          const randomDice = getRandomDiceIcon();
          copyRandomBtn.innerHTML = `<i class="bi ${randomDice}"></i>`;
        });
      }
    });
  });

  // Function to update the displayed list of blocked IDs
  function updateBlockedIds(blockedIds) {
    blockedIdsContainer.innerHTML = '';
    blockedIds.forEach(id => {
      const link = `https://www.youtube.com/watch?v=${id}`;
      const idContainer = document.createElement('div');
      idContainer.className = 'id-container';

      const idSpan = document.createElement('span');
      idSpan.className = 'monospace';
      idSpan.textContent = id;

      // Set up the delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'icon-btn';
      deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
      deleteBtn.addEventListener('click', () => {
        chrome.storage.local.get(['blockedIds'], (res) => {
          const blockedIds = res.blockedIds ?? [];
          const index = blockedIds.indexOf(id);
          if (index > -1) {
            blockedIds.splice(index, 1);
            chrome.storage.local.set({ blockedIds }, () => {
              updateBlockedIds(blockedIds);
            });
          }
        });
      });

      // Set up the copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'icon-btn';
      copyBtn.innerHTML = '<i class="bi bi-copy"></i>';
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(link).then(() => {
          copyBtn.innerHTML = '<i class="bi bi-clipboard-check"></i>';
          setTimeout(() => {
            copyBtn.innerHTML = '<i class="bi bi-copy"></i>';
          }, 2000);
        });
      });

      idContainer.appendChild(idSpan);
      idContainer.appendChild(copyBtn);
      idContainer.appendChild(deleteBtn);
      blockedIdsContainer.appendChild(idContainer);
    });
  }
});
