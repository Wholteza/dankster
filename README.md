#   Readme

This bot sucks but you may use it however you like.

It has functions such as:
    
*   Managing a whitelist based on peoples discord tags to defend destructive commands. The first tag in the list of whitelisted people is protected against removal, to implement somewhat of a owner status.
*   Managing a list of subreddits.
*   Fetching 1-5 random images from your selection of subreddits.
*   Fetching a random image of a puppy.
*   Posting the link to a epic dota 2 streamer intro.
*   Seeing what times my fried raid in Wow..
*   Displaying a help dialog.

As you see, i probably just uploaded it to github to have an easy way to distribute the bot to my server.

Anyhows this is how you set it up:

1.  Clone the repo.
2.  Install node >= 10 (may work with earlier versions, using some arrow functions and other shizzle).
3.  Create a "settings.json" file and type:
    
        {
            "token": "Your bot token here",
            "commandPrefix": "!"
        }
    This is so i have zero chances of accidently including the token in my repo. Applications, bots and tokens can be created here https://discordapp.com/developers. But you should probably use some guide if you've never done it before.
    Go to the OAuth section of your application, add the permissions and navigate to the generated link to add it to your server
4.  Open the "whitelist.json" and add your discord tag to the whitelist so you may manage everything from the discord chat later.
5.  Run "npm install" in the repository folder to install the dependencies.
6.  Run "node bot.js" to start the bot.

If you have configured your bot to use the right server in your registered application it should come online in that server and you can start with typing "!help".

The discord.js library uses the Apache 2.0 license and can be found here: https://github.com/discordjs/discord.js/blob/master/LICENSE

The random-puppy library that fetches images from reddit uses the MIT license and can be found here:
https://github.com/dylang/random-puppy/blob/master/license

Both licences are available in the Licenses folder in this repository.

Regarding my code, you can do whatever you want with it, but i am not responsible for anything, glhf.
