# Beldum-Bot
<img src="https://raw.githubusercontent.com/Tony120914/Beldum-Bot/main/assets/shiny-beldum-oras-promo.png" width=30% align="right">

Hey, a cool Discord bot application.

Check it out. ¯\\\_(ツ)_/¯

- [Invite](https://discord.com/oauth2/authorize?client_id=454764425090433034) this bot to your Discord server.
- See the [documentation](https://tony120914.github.io/beldum-bot-site/#/docs) for help regarding the commands.

<img src="https://top.gg/api/widget/454764425090433034.svg">

## Installation Guide
1. Download the latest [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) and place it in the root directory
2. Rename the .exe file to `cloudflared.exe`
3. Create a `.dev.vars` file in the root directory matching the structure of `.sample.vars`
4. `npm install`

### Development
5. `npm run dev`
6. `npm run tunnel` (if successful, you should get a URL)
7. Login to [Discord Developer Portal](https://discord.com/developers/applications)
8. Select a bot application and paste the tunnel URL into the `INTERACTIONS ENDPOINT URL` field
