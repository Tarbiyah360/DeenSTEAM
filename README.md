DeenSTEAM Lesson Generator and STEAM explorer
Testing restoration pull request

Science lesson plans with integrated islamic reflections.
(STEAM is an acronym for Science Technology Engineering Art and Mathematics )

## Project info

This project is deployed on [Vercel](https://vercel.com/)
**URL**: https://www.deensteam.co.uk/

Built using React + Vite + Supabase + Edge Functions + Gemini Flash AI

## Overview:
DeenSTEAM application generates holistic education resources integrating Islamic values(deen) into STEAM curriculum using only Safe and Ethical AI solutions, all on one platform, integrated throughout the lesson plans nurturing faith (Deen) and worldly excellence (Dunya) together.


To run this project on your PC, create a new .env file using the .env.example file.

**Use your preferred IDE**

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <GIT_URL>

# Step 2: Install the necessary dependencies.
npm i

# Step 3: Start the development server with auto-reloading and an instant preview.
npm run dev
```
## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS 
- Supabase (Database + Storage + Edge Functions)
- Gemini AI API (free tier)

## How it works:
Users (Parents and Educators) select age+topic , click generate and the app returns a a complete lesson plan aligned with UK National curriculum for ages 5-11 years.
The lesson plan contains 'objectives, Detailed instructions of 2/3 fun STEM activities , list of materials needed, Muslim Scientists connection and Islamic refelction. The lessons can be downloaded as pdf for sharing or printing.

## Edge funtion logic:
checks if lesson exists --> returns cached 
If not ----> calls backend --> starts RAG process: creates embeddings from provided datasource --> retrieves related documents --> builds a contexual prompt --> calls gemini to genrate a new lesson with age+topic ---> stores lesson --> Returns

## Notes:
This app uses AI responsibly,
All lessons are generated with ethical guidelines, avoiding harmful content , remain aligned with Islamic Values and child - safety standards
