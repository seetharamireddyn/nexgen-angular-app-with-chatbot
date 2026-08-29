# NexGen Innovations — Angular Static Website

A responsive Angular website using the supplied NexGen Innovations logo.

## Run locally

1. Install Node.js.
2. Open a terminal in this project folder.
3. Run:

```bash
npm install
npm start
```

4. Open `http://localhost:4200`.

## Build

```bash
npm run build
```

Production output is generated under `dist/nexgen-innovations`.

## Logo

The supplied logo is stored at:

`src/assets/nexgen-logo.png`

Replace it later with an official high-resolution SVG/PNG if available.

## Contact chatbot

Clicking **Contact Us** opens a chatbot-style contact assistant.

The assistant provides:
- Business / IT Services
- Training & Talent Development
- Pharma + Tech Services
- Send an Inquiry

The inquiry form currently uses a `mailto:` link so it opens the visitor's default email application.

### Important

In `src/app/app.component.ts`, replace:

`info@example.com`

with your actual company inquiry email.

For a production website, the `sendInquiry()` method can later be changed to call your backend API instead. This is preferable if you want the inquiry to be submitted without requiring the visitor to have a local email application.

## Future enhancements

The Angular structure can be extended with:
- Backend contact API
- Email service integration
- Training programs
- Course listings
- Login/registration
- Blog/news
- Admin dashboard
- AI chatbot
