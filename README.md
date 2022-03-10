# CSE 115a Meal Prep

CSE 115a group project


Development Setup

Install project dependencies
* Run 'npm run install-backend' in the root of project
* Run 'npm run install-frontend' in the root of project
Setup local database
* Download Docker
* In the backend folder, run 'docker compose up -d'


Running the project

Frontend
* Run 'npm run start-frontend' in root of project or 'npm start' in the frontend folder
Backend
* Run 'npm run start-backend' in root of project or 'npm start' in the backend folder
Database
* Run 'docker compose start' in the backend folder

Docker commands for database


Create docker container for database
* In the backend folder, run 'docker compose up -d'

Stop the database in docker
* In the backend folder, run 'docker compose stop'
* 
Start the database in docker
* In the backend folder, run 'docker compose start'

If making any changes to the data/schemas, rebuild the container to apply the changes
* Remove the image 'docker compose down'
* Rebuild the image 'docker compose up -d'





