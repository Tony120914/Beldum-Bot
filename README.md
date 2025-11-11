# Beldum-Bot
[![Test & Deploy](https://github.com/Tony120914/Beldum-Bot/actions/workflows/wrangler.yml/badge.svg)](https://github.com/Tony120914/Beldum-Bot/actions/workflows/wrangler.yml)
<img src="https://raw.githubusercontent.com/Tony120914/Beldum-Bot/main/assets/shiny-beldum-oras-promo.png" width=30% align="right">

Hey, a cool Discord bot application.

Serverless and supports slash commands.

Check it out. ¯\\\_(ツ)_/¯

- [Invite](https://discord.com/oauth2/authorize?client_id=454764425090433034) this bot to your Discord server.
- See the [documentation](https://tony120914.github.io/beldum-bot-site/#/docs) for help regarding the commands.
- [Support](https://tony120914.github.io/beldum-bot-site/#/support) the bot!
- [Source Code](https://github.com/Tony120914/Beldum-Bot)

<img src="https://top.gg/api/widget/454764425090433034.svg">

## Installation
1. Download the latest [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) and place it in the root directory
2. Rename the .exe file to `cloudflared.exe`
3. Create a `.dev.vars` file in the root directory matching the structure of `.sample.vars`
4. `npm install`

## Development
1. `npm run dev`
2. `npm run tunnel` (if successful, you should get a URL)
3. Login to [Discord Developer Portal](https://discord.com/developers/applications)
4. Select a bot application and paste the tunnel URL into the `INTERACTIONS ENDPOINT URL` field

### Register Commands
1. **MAKE SURE THE VARIABLES IN `.dev.vars` ARE CORRECT**
2. `npm register`

## Advertisement
Currently advertised on:
* [GitHub Pages](https://tony120914.github.io/beldum-bot-site/)
* [Discord App Directory](https://discord.com/discovery/applications/454764425090433034)
* [Top.gg](https://top.gg/bot/454764425090433034)
* [Discord Bots](https://discord.bots.gg/bots/454764425090433034)
* [Discord Bot List](https://discordbotlist.com/bots/beldum-bot)
