DeenSTEAM AI Lesson Generator and STEAM explorer
STEAM Learning viewed through Islamic lens.
(STEAM is an acronym for Science Technology Engineering Art and Mathematics )

## Project info

This project is deployed on [Vercel](https://vercel.com/)
**URL**: https://www.deensteam.co.uk/

Built using React + Vite + Supabase + Edge Functions + Gemini Flash AI 

## Overview:
DeenSTEAM application generates holistic education resources integrating Islamic values(deen) into STEAM curriculum using only Safe and Ethical AI solutions, all on one platform, integrated throughout the lesson plans nurturing faith (Deen) and worldly excellence (Dunya) together.


There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE,

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

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

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


## Credits :
Intitial design created with the help of Lovable.dev AI tools

## Data source:
Content related to STEAM activity structure and learning objectives is based on information publicly available from UK national curriculum.

Historical scientists information in this project is based on publicly available facts. Some inspiration for Scientist's profiles was taken from '1001 inventions' intiative. No text or images were copied, all content is original.

For Qur'an reflection, open source curated resources were used.

For feedback on further development of this project:
Please fill this form -https://forms.gle/79TaQh6Vj5xTXxE3A

