(() => {
  const titleKeywords = [
    'rick',
    'roll',
    'astley',
    'never gonna give you up'
  ];
  const blockedBitlyIds = [
    '3MEvBVv',
    '3IPcuoB',
    '3BlS71b',
    '33dDYEz'
  ];
  const consumedBypassUrls = new Set();

  // Grab the storage every time in case an ID gets added while browsing
  const checkLink = () => chrome.storage.local.get(['blockedIds', 'bypassed', 'bypassedUrl', 'totalRickRolls', 'extDisabled', 'mostVisited', 'blockTitleKeywords'], res => {
    const blockedIds = res.blockedIds || [];

    // Check if blocking is enabled
    if (res.extDisabled) {
      console.log('Anti Rickroll extension is disabled.');
      return;
    }

    const currentUrl = location.href;
    const currentLocation = new URL(currentUrl);

    if (consumedBypassUrls.has(currentUrl)) {
      return;
    }

    const isBitly = currentLocation.hostname === 'bit.ly' || currentLocation.hostname.endsWith('.bit.ly');
    const bitlyCode = isBitly ? currentLocation.pathname.replace(/^\//, '').split('/')[0] : '';

    // Check if the URL contains any of the blocked IDs
    const foundId = blockedIds.find(id => currentUrl.includes(id));
    const foundBitlyId = isBitly ? blockedBitlyIds.find(id => bitlyCode === id) : null;
    const isYouTubeWatchSurface = currentLocation.hostname.includes('youtu.be') || (
      currentLocation.hostname.includes('youtube.com') && (
        currentLocation.pathname === '/watch' ||
        currentLocation.pathname.startsWith('/shorts/')
      )
    );
    const currentTitle = document.title.toLowerCase();
    const foundTitleKeyword = (res.blockTitleKeywords && isYouTubeWatchSurface)
      ? titleKeywords.find(keyword => currentTitle.includes(keyword))
      : null;
    const foundMatch = foundId || foundBitlyId || foundTitleKeyword;
    const bypassedUrl = res.bypassedUrl || '';
    const hasMatchingBypass = res.bypassed && bypassedUrl === currentUrl;

    // If the bypass was used for this exact URL, consume it once and let this page load
    if (hasMatchingBypass) {
      consumedBypassUrls.add(currentUrl);
      chrome.storage.local.set({ bypassed: false, bypassedUrl: '' });
      return;
    }

    if (res.bypassed && bypassedUrl && bypassedUrl !== currentUrl) {
      chrome.storage.local.set({ bypassed: false, bypassedUrl: '' });
    }

    // If there is a match and the user hasn't bypassed this URL show the warning page
    if (foundMatch) {
      if (!hasMatchingBypass) {
        // Check if the array of blocked URLs exists or not and update it
        if (res.mostVisited) {
          const mostVisitedArray = res.mostVisited;
          mostVisitedArray.push(foundId || foundBitlyId || `title:${foundTitleKeyword}`);
          chrome.storage.local.set({ "mostVisited" : mostVisitedArray });
        } else {
          const mostVisitedArray = [];
          mostVisitedArray.push(foundId || foundBitlyId || `title:${foundTitleKeyword}`);
          chrome.storage.local.set({ "mostVisited" : mostVisitedArray });
        }

        // Update total rickrolls blocked counter
        chrome.storage.local.set({ totalRickRolls: (res.totalRickRolls ?? 0) + 1 })

        // Display the warning page
        location.replace(chrome.runtime.getURL('warn/warn.html') + '?' + location.href);
      }
    }
  });

  // Make sure it is not already on a blocked link
  checkLink();

  // Hook into the Youtube navigation event
  addEventListener('yt-navigate-start', checkLink);
  addEventListener('yt-navigate-finish', checkLink);
  addEventListener('load', checkLink);
})();