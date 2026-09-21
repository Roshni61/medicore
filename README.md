🏥 MediCore — Smart Healthcare & Hospital Management Platform
A smart healthcare and hospital management platform developed as a hackathon prototype for DevFusion 4.O.

MediCore provides role-based dashboards for different hospital users, demonstrating how healthcare operations can be managed through a unified digital platform.

Note: This is a frontend-only prototype built with mock data. No backend or database is required to run the project.

✨ Features
Role-based access for six user roles
Patient dashboard
Doctor dashboard
Receptionist dashboard
Lab staff dashboard
Pharmacist dashboard
Admin dashboard
Quick demo login
Interactive charts and analytics
Responsive user interface
👥 User Roles
Role	Description
Patient	Access healthcare-related information and services
Doctor	View and manage patient and medical information
Receptionist	Handle appointments and patient-related operations
Lab Staff	Manage laboratory-related workflows
Pharmacist	Handle medicine and pharmacy-related information
Admin	Monitor and manage overall hospital operations
🛠️ Tech Stack
React
Vite
Tailwind CSS
Recharts
Lucide React
📂 Project Structure
medicore/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx        # Application entry point
    ├── App.jsx         # Main application wrapper
    ├── MediCore.jsx    # Core application, views, and mock data
    └── index.css       # Global styles and Tailwind directives
🚀 Getting Started
1. Clone the Repository
git clone <your-repository-url>
2. Navigate to the Project Folder
cd medicore
3. Install Dependencies
npm install
4. Start the Development Server
npm run dev
Open the URL displayed in the terminal.

📦 Build for Production
Create a production build:

npm run build
Preview the production build locally:

npm run preview
🔑 Demo Login
The application includes a Quick Demo Login option on the login screen.

You can directly access dashboards for:

Patient
Doctor
Receptionist
Lab Staff
Pharmacist
Admin
No real authentication or credentials are required for the demo.

📊 Project Notes
This is a frontend-only prototype.
All data is mocked.
Mock data and application views are managed in src/MediCore.jsx.
No backend server is required.
No database is connected.
No external API calls are made.
🚀 Future Enhancements
Backend and database integration
Secure authentication and authorization
Real-time appointment management
Electronic health record management
Prescription management
Medicine inventory tracking
Lab report management
Notifications and reminders
AI-powered healthcare assistance
🏆 Hackathon Project
This project was developed as a prototype for DevFusion 4.O to demonstrate how multiple healthcare and hospital workflows can be integrated into a single digital platform.

👩‍💻 Author
Jiya Darshini
Roshni K

⭐ If you find this project interesting, consider giving the repository a star!
