# pollBot

## General info
A discord bot for making polls

*   User can create polls with up to 5 choices for a server to vote on 

## Tech
Created with js
* Using the discord.js library to interact with the Discord api.
* Using quickchart-js library to chart the results of a poll

## Todo
* Make as an option so that users can select multiple answers?
* Allow users to change votes

## Setup
To run this project, install it locally using npm:

```
$ npm install
$ node deploy-commands.js
$ npm run start
```

Will require the following in an .env file:
* BOT_TOKEN = Discord bot token
* CLIENTID = Discord bot client ID
* GUILDID = Discord server ID

## Screenshots
![Poll function](/screenshots/poll.png?raw=true)