# Anti Rickroll Chrome Extension

![icon](/icons/icon128.png)

## About
I was tired of getting rickrolled, so I started using this Chrome extension. However, when I realized it was not finished, I took it upon myself to do so. If you like this extension or found it useful, I would appreciate if you starred it or even shared it with your friends. I will continue to update this repository as I add new features. 

## Acknowledgements
As mentioned above, this extension was originally created by [Daniel Norhøj](https://github.com/dnorhoj). Because the GPL license was included, I have taken the code and improved upon it. The basic functionality and logic is not mine, however, so most of the credit should go to him. I do also have to give credit to Super02, who initially proposed some of the ideas I implemented. 

## Changes
* Working local database of rickroll links on YouTube that can be updated (not synced with other users)
* Optional password to continue to the rickroll (added after my friends Rickrolled me on my own computer)
* Improved popup with a button to close it and bonus page with Rick and lyrics
* Pure HTML, CSS, and JS code (no more Svelte, so it’s easier to understand)
* Working stats page tracks number of rickrolls blocked/bypassed and most common links
* Ability to copy the full URL of any video or a random one from the database 
* One-click button to easy add a link to your personal database
* Clear indication when the extension is turned off
* Modernized warning page design with an improved description
* New: ability to block all videos whose title contains specific keywords
* New: block both YouTube and Bitly rickroll links

## Installation
1. Clone this repository or download it as a zip folder and uncompress it.
2. Navigate to `chrome://extensions` and turn on developer mode. 
3. Click on the 'Load Unpacked' button on the top left. 
4. Navigate to the uncompressed folder containing the files and select it. 
5. Pin the extension to the toolbar if it is not already there. 

## Bugs
If you find one, feel free to open up a new issue or even better, create a pull request fixing it. But then again, this extension is relatively simple, so I don't expect for there to be any.

## To-Do List
- [ ] Make rickroll database global
- [ ] Add support for other link shorteners

## Contributors
Sachin Agrawal: I'm a self-taught programmer who knows many languages and I'm into app, game, and web development. For more information, check out my website or Github profile. If you would like to contact me, my email is [github@sachin.email](mailto:github@sachin.email).

## License
This package is licensed under the [GPL-3.0 License](LICENSE.txt).