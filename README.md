<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Semantic Recipe Finder

A warm, cozy web app that helps people figure out what to make for dinner with their available ingredients.

</div>

## What is this?

Ever stared at a fridge full of mismatched ingredients—like half a lemon, wilted spinach, and frozen tilapia—and thought, "What on earth can I make with this?" Semantic Recipe Finder acts as your personal AI Sous-Chef. Just type out what you have on hand and how much time you have, and the app will generate a delicious, step-by-step recipe tailored exactly to your situation.

Originally built as a Google AI Studio applet, this project has been upgraded into a standalone Next.js application. It is now provider-agnostic, meaning you can power it with any AI model you want (like Groq, OpenAI, or Anthropic)!

## Features

Natural Language Search: Type exactly how you feel (e.g., "I'm tired, I have 15 mins, and I only have eggs and rice").

AI-Powered: Uses Large Language Models to invent recipes on the fly and return them in a beautifully structured format.

Cook Mode: A distraction-free, large-text UI designed for when your hands are messy in the kitchen.

Docker Ready: Comes with a fully optimized Docker setup for easy deployment anywhere.

## How to Run the App (Using Docker)

The easiest way to run this app is using Docker. You will need an API key from an LLM provider (like Groq or OpenAI) to power the chef's brain.

#### Prerequisites

Docker Desktop (or Docker Engine) installed on your machine.

An API key from your chosen AI provider.

#### Option 1: The Quick Command

Clone this repository and open your terminal in the project folder.

Build the Docker image:

```
docker build -t recipe-finder-app .
```

Run the container, passing your API key as an environment variable:

```
docker run -p 3000:3000 -e MY_LLM_API_KEY="your_api_key_here" recipe-finder-app
```

Open http://localhost:3000 in your browser!

#### Option 2: Using Docker Compose (Recommended)

If you don't want to paste your API key in the terminal every time, use Docker Compose.

Create a file named docker-compose.yml in the root directory with this content:

version: '3.8'
services:
  recipe-app:
    image: recipe-finder-app
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env


Create a .env file in the same directory and add your key:

MY_LLM_API_KEY=your_api_key_here


Start the app:

```
docker compose up --build
```

(Note: Please do not commit your .env file to GitHub)

### How to Run for Development (No Docker)

If you want to edit the code, tweak the UI, or change the AI model prompt, you can run the app locally using Node.js.

Install dependencies:

```
npm install
```

Set up your environment variables:
Create a .env.local file in the root folder and add your API key:

MY_LLM_API_KEY="your_api_key_here"


Start the development server:

```
npm run dev
```

Start cooking! Open http://localhost:3000 to see your changes live.

### Tech Stack

Framework: Next.js 15 (App Router)

Styling: Tailwind CSS v4

Icons: Lucide React

Deployment: Docker (Standalone output)
