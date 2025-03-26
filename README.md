# Express-Bild - EB Jobtype Categorizer
### Lucas H. Schuber
### Software developer / Systemutvecklare

This repository contains the web applications job-type-categorizer where the user can assign categories to job types and create new categories. 
- Job Type Categorizer 
- Categoriy Managment

### Installation
1. Clone this repository:
   git clone https://github.com/LucasHSchuber/EB_jobtype_categorizer.git
   cd EB_jobtypes_categories
2. Run 'npm install'
3. Run 'npm run dev' to start the server locally

## Important Files:
- .env IN ROOT
- .env.production IN ROOT
- apiConfig.ts in src/assets/js/


.env:
VITE_API_URL=http://localhost:5001/
VITE_TOKEN=my_token

.env.production:
VITE_API_URL=my_prodcution_api_url

apiConfig:
export const API_URL = import.meta.env.VITE_API_URL;
export const TOKEN = import.meta.env.VITE_TOKEN;