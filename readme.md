# Tabulatr...

... is my first shot at a chrome extension. As of now the project is heavily work in progress, so expect any experience with it to be shaky. I'll be iterating on it daily, so if you're interested, check back every now and then!

## Premise:

Prevent accidentally accumulating multiple "zombie" instances of websites you only ever need one instance of open at a time. This will be different for everyone - for me it's things like Facebook, gmail etc.

## How to install:

Download the repo and unzip. Open chrome's extensions panel, click "Developer mode" and then "Load unpacked extension" and point to the folder you just unzipped. That's it!

## How to use:

At the moment the functionality is pretty bare-bones. When you first load the extension it'll initialize to add ".facebook" and "mail.google" to the list of addresses to watch. You can add any you want by entering them in the input box, and there are basic tools for clearing the list or only removing the last site on the list (the ui doesn't update automatically on removal, but if you click the extension's icon again it'll display the up to date list). I'm still working on precisely how to ask users to format their entries - for the time being I've found that it's safest to use some version of ".[root domain]" - please feel free to play around with that and let me know what does and does not work!

Lastly - the functionality of the extension is mostly consistent but it sometimes "forgets" a tab. This is being worked on!

Have fun!
