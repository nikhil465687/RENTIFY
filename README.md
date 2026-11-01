🏠 Rentify – AI-Powered Rental Marketplace

Rentify is a multi-category rental marketplace that allows users to discover and rent everyday products without purchasing them. From furniture and home appliances to electronics, vehicles and adventure equipment, Rentify makes renting simple and convenient.

It also features an AI-powered recommendation system called Life Mode, which understands users’ real-life requirements and recommends suitable rental products using Google Gemini AI.

🚀 Features

🛍️ Multi-Category Rental Marketplace

* Explore products across multiple rental categories.
* Browse product details, pricing and availability.
* Search and discover rental products.
* View product information before booking.

🤖 AI-Powered Life Mode

* Understands natural-language rental requirements.
* Uses Google Gemini AI to identify user needs.
* Recommends relevant products from the MongoDB catalogue.
* Supports budget-based recommendations.
* Provides requirement fulfilment information.

🛒 Rental Cart & Booking

* Add products to the cart.
* Manage selected rental products.
* Continue through the booking workflow.
* View booking confirmation.

🧰 Tech Stack

Technology	Purpose
React.js	Frontend development
Vite	Frontend development server
JavaScript	Application logic
HTML5	Structure
CSS3	Styling
Node.js	Backend runtime
Express.js	Backend API
MongoDB Atlas	Database
Mongoose	MongoDB object modelling
Google Gemini AI	AI-powered recommendations
Git & GitHub	Version control

📁 Project Structure

RENTIFY/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md

⚙️ Installation & Setup

1. Clone the repository

git clone https://github.com/nikhil465687/RENTIFY.git

2. Navigate to the project

cd RENTIFY

3. Setup the Backend

cd backend
npm install

Create a .env file inside the backend folder:

PORT=5050
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite

Replace the placeholder values with your own credentials.

Start the backend:

node server.js

Backend runs at:

http://localhost:5050

4. Setup the Frontend

Open another terminal:

cd RENTIFY/frontend
npm install

Start the frontend:

npm run dev

Open the local URL displayed by Vite, usually:

http://localhost:5173

🔐 Environment Variables

The application requires:

* MongoDB Atlas connection string.
* Google Gemini API key.
* Backend port configuration.

Important: Never upload your .env files, API keys or database credentials to GitHub.

🧠 AI Integration

Rentify uses Google Gemini AI to power its Life Mode recommendation experience.

The recommendation workflow:

1. User describes their rental requirements.
2. Gemini AI interprets the user’s needs.
3. The backend retrieves available products from MongoDB.
4. Products are matched against the extracted requirements.
5. Budget optimization selects a suitable combination.
6. Recommendations are returned to the frontend.

🎯 Project Objective

The objective of Rentify is to make everyday products more accessible through renting rather than purchasing.

Rentify aims to provide a convenient, flexible and intelligent rental experience for users with different needs and budgets.

👨‍💻 Developer

Nikhil Rathore

GitHub: @nikhil465687

📌 Repository

https://github.com/nikhil465687/RENTIFY

⸻

Rent smarter. Live better. ♻️
