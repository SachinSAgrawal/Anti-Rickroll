(() => {
  const titleKeywords = [
    'rick',
    'roll',
    'astley',
    'never gonna give you up'
  ];

  /*
  let blockedBitlyIds = [
    "3MEvBVv",
    "3IPcuoB",
    "3BlS71b"
  ];
  */

  // Grab the storage every time in case an ID gets added while browsing (futureproofing)
  const checkLink = () => chrome.storage.local.get(['blockedIds', 'bypassed', 'totalRickRolls', 'extDisabled', 'mostVisited', 'blockTitleKeywords'], res => {
    const blockedIds = res.blockedIds || [];

    // Check if blocking is enabled
    if (res.extDisabled) {
      console.log('Anti Rickroll extension is disabled.');
      return;
    }

    const currentUrl = location.href;

    /*
    // Check if the link is either Youtube or Bitly
    const isYouTube = currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be');
    const isBitly = currentUrl.includes('bit.ly');

    // Print to the console accordingly
    if (isYouTube) {
      console.log("youtube")
    }
    if (isBitly) {
      console.log("bitly")
    }
    */

    // Check if the URL contains any of the blocked IDs
    const foundId = blockedIds.find(id => currentUrl.includes(id));
    const isYouTube = currentUrl.includes('youtube.com') || currentUrl.includes('youtu.be');
    const currentTitle = document.title.toLowerCase();
    const foundTitleKeyword = (res.blockTitleKeywords && isYouTube)
      ? titleKeywords.find(keyword => currentTitle.includes(keyword))
      : null;
    const foundMatch = foundId || foundTitleKeyword;

    // Save it and continue with the rest of the logic
    if (foundMatch) {
      // If not bypassed (user clicked continue), show warning page
      if (!res.bypassed) {
        // Check if the array of blocked URLs exists or not and update it
        if (res.mostVisited) {
          const mostVisitedArray = res.mostVisited;
          mostVisitedArray.push(foundId || `title:${foundTitleKeyword}`);
          chrome.storage.local.set({ "mostVisited" : mostVisitedArray });
        } else {
          const mostVisitedArray = [];
          mostVisitedArray.push(foundId || `title:${foundTitleKeyword}`);
          chrome.storage.local.set({ "mostVisited" : mostVisitedArray });
        }

        // Update total rickrolls blocked counter
        chrome.storage.local.set({ totalRickRolls: (res.totalRickRolls ?? 0) + 1 })

        // Display the warning page
        location.replace(chrome.runtime.getURL('warn/warn.html') + '?' + location.href);
      } else {
        chrome.storage.local.set({ bypassed: false });
      }
    }
  });

  // Make sure it is not already on a blocked link
  checkLink();

  // Hook into the Youtube navigation event
  addEventListener('yt-navigate-start', checkLink);
  addEventListener('yt-navigate-finish', checkLink);
  addEventListener('load', checkLink);

  /*
  // Check for Bitly links on page load and whenever the URL changes
  window.addEventListener('load', checkLink);
  window.addEventListener('hashchange', checkLink);
  window.addEventListener('popstate', checkLink);
  */
})();