📊 PrimeReact Paginated DataTable(React + TypeScript + Vite) 
LIVE DEMO:https://art-table1.netlify.app/

This project is a React application built with Vite and TypeScript that demonstrates a server-side paginated DataTable with row selection persistence using PrimeReact components.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

🚀 Features
✅ Vite + React + TypeScript project setup
✅ PrimeReact DataTable integration
✅ Server-side Pagination (no client-side storage of all rows → avoids memory issues)
    * Fetches data for the respective page only when the page is visited
    * API is called every time user navigates to a page
✅ Row Selection with Checkboxes
    * Select/Deselect single rows
    * Select/Deselect all rows
✅ Custom Row Selection Panel
    * Triggered using a Chevron Down Icon
    * Displays currently selected rows
    * Allows users to submit or modify selection
✅ Persistent Row Selection Across Pages
    * If a row is selected on Page 2 and you move to Page 3, the selection is remembered
    * On revisiting Page 2, the previous selection/deselection persists
✅ Responsive & Styled with PrimeReact themes

🛠️ Tech Stack
React 18 + Vite (fast dev environment)
TypeScript (type safety)
PrimeReact (UI components)
PrimeIcons (icons for chevron, etc.)
PrimeFlex (optional for styling utilities)



⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

2️⃣ Install Dependencies
npm install

3️⃣ Start Development Server
npm run dev

App runs at: http://localhost:5173/

🌐 Deployment

The app is deployed on Netlify/Cloudflare (not Vercel).
🔗 Live Demo: https://art-table1.netlify.app

