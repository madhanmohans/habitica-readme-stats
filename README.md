# Habitica README Stats 🎮

Show your Habitica stats dynamically in your GitHub README! Just like GitHub profile stats, but for your Habitica character progress.

![Example Habitica Stats](https://your-domain.vercel.app/api/habitica-stats?debug=simple)

## 🚀 Quick Setup

1. **Deploy your own instance** (recommended for security)
2. **Set environment variables** with your Habitica credentials
3. **Add to your README** with a simple, secure URL

```markdown
![My Habitica Stats](https://your-deployed-app.vercel.app/api/habitica-stats)
```

That's it! No tokens in URLs, completely secure! 🔒

## 📋 Getting Your Habitica Credentials

1. **Get your User ID:**
   - Go to [Habitica Settings → API](https://habitica.com/user/settings/api)
   - Copy your User ID

2. **Get your API Token:**
   - In the same API settings page
   - Copy your API Token
   - ⚠️ **Keep this secret!** Never put it in URLs or public repositories

## 🛡️ Secure Deployment

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

## 🎨 Customization

### Themes

Choose from different visual themes by adding a `theme` parameter:

```markdown
<!-- Default purple theme -->
![Habitica Stats](https://your-app.vercel.app/api/habitica-stats)

<!-- Dark theme -->
![Habitica Stats](https://your-app.vercel.app/api/habitica-stats?theme=dark)

<!-- Light theme -->
![Habitica Stats](https://your-app.vercel.app/api/habitica-stats?theme=light)
```

### Available Themes:
- `default` - Classic purple Habitica theme 💜
- `dark` - Dark theme for dark backgrounds 🌙
- `light` - Light theme for light backgrounds ☀️

## 📊 What's Displayed

The stats card shows:
- **🎮 Character Class & Level** - Your current class and level
- **❤️ Health** - Current HP vs Max HP with red progress bar
- **⭐ Experience** - Current XP vs XP needed for next level with yellow progress bar  
- **💎 Mana** - Current MP vs Max MP with blue progress bar

## 🔒 Security & Privacy

✅ **Fully Secure Implementation:**
- No API tokens exposed in URLs
- Credentials stored safely in environment variables
- Direct API calls to Habitica servers only
- No credentials stored or logged anywhere
- Images cached for 30 minutes to reduce API calls
- Only reads basic character stats (no sensitive data)

## 🛠️ Development

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

### Debug Mode

Test the API without setting up credentials:

```
https://your-app.vercel.app/api/habitica-stats?debug=simple
```

## 🌟 Features

- ⚡ **Fast**: Edge runtime for lightning-fast responses
- 🔒 **Secure**: No exposed credentials, environment-based auth
- 🎨 **Customizable**: Multiple themes to match your style
- 📱 **Responsive**: Works perfectly in GitHub READMEs
- 🚀 **Reliable**: Proper error handling and caching
- 💾 **Optimized**: Smart caching for GitHub's requirements

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📄 License

MIT License - feel free to use this for your own projects!

## Credits

Inspired by [anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats)

Built with:
- [Next.js](https://nextjs.org) & Vercel Edge Runtime
- [Vercel OG](https://vercel.com/docs/functions/edge-functions/og-image-generation) for fast image generation
- [Habitica API v3](https://habitica.com/apidoc/) for stats data
