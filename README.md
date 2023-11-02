# Maintenance-management
A React app (frontend) that uses Express and Mongoose (backend) to manage jobs in a maintenance company. A user is able to submit a job with all the relevant details. Each job should have a status, being one of submitted, in progress, and completed. Deleting should archive a specific job (so that it is no longer shown on the list, but isn't totally deleted). The user is also able to update status of multiple jobs at once (batch update).

## To use this app with a browser, do the following:
#### Backend
- Clone the repo to you local machine
- Open the project and in your command line interface, navigate to this folder and type `npm install`.
- Run the backend typing `npm start`. The project will automatically reload everytime changes are made. 
- The backend will run on http://localhost:8080/
- If you do not have MongoDB account already, create a new one [here](https://www.mongodb.com/)
- Inside MongoDB, create a collection/'table' called 'jobs' and insert the sample data below to get started

`db.jobs.insertMany([{description: 'Geyser Burst', location: 'San Ridge Village', priority: 'High', status: 'submitted', archived: false, createdAt: new Date(), updatedAt: new Date()}, {description: 'Blown light', location: 'Erand Gardens', priority: 'Low', status: 'submitted', archived: false, createdAt: new Date(), updatedAt: new Date()}, {description: 'Maw the lawn', location: 'Erand Gardens', priority: 'Medium', status: 'submitted', archived: true, createdAt: new Date(), updatedAt: new Date()}, {description: 'Repainting', location: 'Erand Court', priority: 'Low', status: 'submitted', archived: false, createdAt: new Date(), updatedAt: new Date()}]);`

- In the root folder, create a `.env` file and add your connection string as follows: 

`MONGODB_URI="your-mongodb-uri-here"`
- NB!!! Remember not to ever publish your connection string to GitHub 

#### Frontend
- Open another instance of the terminal on your project and navigate to the frontend by typing `cd frontend`. 
- Install the dev dependecies for the frontend application by typing `npm install`.
-  Run the frontend by typing `npm start`. The project will automatically open the application on http://localhost:3000/ and it will reload everytime changes are made. 
- Search for a user and you will be able to see the profile, some of their repos, commits, etc...
