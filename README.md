# Habitica README Stats

Just like GitHub profile stats, but for your Habitica character progress.

## Quick Setup

1. **Deploy your own instance** (recommended for security)
2. **Set environment variables** with your Habitica credentials
3. **Add to your README** with a simple, secure URL

```markdown
![My Habitica Stats](https://your-deployed-app.vercel.app/api/habitica-stats)
```

## Getting Your Habitica Credentials

1. **Get your User ID:**
   - Go to [Habitica Settings → API](https://habitica.com/user/settings/api)
   - Copy your User ID

2. **Get your API Token:**
   - In the same API settings page
   - Copy your API Token
   - ⚠️ **Keep this secret!** Never put it in URLs or public repositories

## Secure Deployment

### Deploy to Vercel (Recommended)

1. **Fork this repository**
2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your forked repository
   - During deployment, add these environment variables:
     - `HABITICA_USER_ID`: Your Habitica User ID
     - `HABITICA_API_TOKEN`: Your Habitica API Token

3. **Use in your README:**
   ```markdown
   ![My Habitica Stats](https://your-app-name.vercel.app/api/habitica-stats)
   ```

### Alternative: Deploy to Netlify, Railway, etc.

Set the same environment variables:
- `HABITICA_USER_ID`
- `HABITICA_API_TOKEN`

## What's Displayed
![habitica-stats](/public/assets/habitica-stats.png)

The stats card shows:
- Your current class and level
- **❤️ health** - current HP / Max HP
- **⭐ experience** - current XP / XP needed for next level
- **💎 mana** - current MP / Max MP 

## Development

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` file:
   ```
   HABITICA_USER_ID=your_user_id_here
   HABITICA_API_TOKEN=your_api_token_here
   ```
4. Run development server: `npm run dev`
5. Test at: `http://localhost:3000/api/habitica-stats`

### Built with
- [Next.js](https://nextjs.org)
- [node-canvas](https://github.com/Automattic/node-canvas) for image generation
- [Habitica API v3](https://habitica.com/apidoc/) for stats data
