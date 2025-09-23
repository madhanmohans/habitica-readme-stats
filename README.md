# Habitica README Stats

Show your Habitica stats dynamically in your GitHub README! Just like GitHub profile stats, but for your Habitica character progress.

## 🚀 Quick Setup

Add this to your README.md and replace `YOUR_USER_ID` and `YOUR_API_TOKEN` with your Habitica credentials:

```markdown
![My Habitica Stats](https://your-domain.vercel.app/api/habitica-stats?userId=YOUR_USER_ID&apiToken=YOUR_API_TOKEN)
```

## 📋 Getting Your Habitica Credentials

1. **Get your User ID:**
   - Go to [Habitica Settings](https://habitica.com/user/settings/api)
   - Copy your User ID

2. **Get your API Token:**
   - In the same API settings page
   - Copy your API Token
   - ⚠️ **Keep this secret!** Don't share it publicly

## 🎨 Customization

### Themes

Choose from different visual themes:

```markdown
<!-- Default theme -->
![Habitica Stats](https://your-domain.vercel.app/api/habitica-stats?userId=YOUR_USER_ID&apiToken=YOUR_API_TOKEN)

<!-- Dark theme -->
![Habitica Stats](https://your-domain.vercel.app/api/habitica-stats?userId=YOUR_USER_ID&apiToken=YOUR_API_TOKEN&theme=dark)

<!-- Light theme -->
![Habitica Stats](https://your-domain.vercel.app/api/habitica-stats?userId=YOUR_USER_ID&apiToken=YOUR_API_TOKEN&theme=light)
```

### Available Themes:
- `default` - Purple Habitica theme
- `dark` - Dark theme for dark backgrounds  
- `light` - Light theme for light backgrounds

## 📊 What's Displayed

The stats card shows:
- **Character Class & Level** - Your current class and level
- **Health** - Current HP vs Max HP with red progress bar
- **Experience** - Current XP vs XP needed for next level with yellow progress bar  
- **Mana** - Current MP vs Max MP with blue progress bar

## 🔒 Security & Privacy

- Your API token is sent directly to Habitica's servers
- No credentials are stored or logged
- Images are cached for 30 minutes to reduce API calls
- The service only reads your basic character stats

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Fork this repository
2. Connect it to [Vercel](https://vercel.com)
3. Deploy automatically
4. Use your Vercel URL in the README examples above

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/your-username/habitica-readme-stats.git
cd habitica-readme-stats
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 🛠️ API Reference

### Endpoint: `/api/habitica-stats`

**Required Parameters:**
- `userId` - Your Habitica User ID
- `apiToken` - Your Habitica API Token

**Optional Parameters:**
- `theme` - Visual theme (`default`, `dark`, `light`)

**Example:**
```
GET /api/habitica-stats?userId=abc123&apiToken=def456&theme=dark
```

**Response:** PNG image (600x400px)

**Caching:** 30 minutes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this in your own projects!

## 💝 Credits

Inspired by [anuraghhazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) - the original GitHub profile stats generator.

Built with:
- [Next.js](https://nextjs.org)
- [Vercel OG](https://vercel.com/docs/functions/edge-functions/og-image-generation) for image generation
- [Habitica API](https://habitica.com/apidoc/) for stats data
