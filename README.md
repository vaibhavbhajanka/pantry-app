# ThePantryApp

A smart pantry management application that helps you keep track of your kitchen inventory and discover new recipes with what you already have.

## What it does

Ever opened your pantry and wondered what you can make with those random ingredients? This app solves that problem. It's a simple yet powerful tool that lets you:

- **Track your pantry items** - Add, remove, and monitor quantities of everything in your kitchen
- **Snap photos to add items** - Point your camera at food items and let AI identify them for you
- **Generate recipes** - Get personalized recipe suggestions based on your current pantry inventory
- **Search your inventory** - Quickly find what you're looking for in your pantry

## Key Features

### Smart Inventory Management
Keep track of everything in your pantry with a clean, intuitive interface. Add items manually or use the camera feature to automatically identify ingredients.

### AI-Powered Image Recognition
Simply take a photo of any food item, and the app will identify it for you using OpenAI's vision capabilities. No more typing out ingredient names!

### Recipe Generation
Stuck on what to cook? Hit the "Generate Recipe" button and get step-by-step cooking instructions using only the ingredients you have on hand.

### User Authentication
Secure Firebase authentication ensures your pantry data stays private and synced across your devices.

## Tech Stack

- **Frontend**: Next.js 14, React, Material-UI
- **Backend**: Firebase (Firestore, Authentication)
- **AI Integration**: OpenAI GPT-4o-mini for image recognition and recipe generation
- **Camera**: React Camera Pro for capturing images

## Project Structure

```
pantry/
├── app/
│   ├── components/
│   │   └── imageUploader.js    # Camera component for item recognition
│   ├── login/
│   │   └── page.js             # Authentication page
│   ├── utils/
│   │   └── imageUtils.js       # Image processing utilities
│   ├── page.js                 # Main pantry interface
│   └── auth.js                 # Firebase authentication logic
├── pages/api/
│   ├── classify-image.js       # OpenAI image classification endpoint
│   └── generate-recipe.js      # OpenAI recipe generation endpoint
└── firebase.js                 # Firebase configuration
```
---

Built using modern web technologies and AI to make kitchen management a breeze.