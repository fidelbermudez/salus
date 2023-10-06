# Salus

## Team and Project Overview:

Project type: Open Project

Project Info: Personal Finance Manager: "Salus"

Team name: Finance Wizards

Team members: 
- Nicole Romero Ospina
- Kelvin Bueno Gonzalez
- Fidel Bermudez Jr
- Israel Briones Jr
- Johnny Cortez

### Milestone 2:

Summary of Progress:
- Nicole Romero Ospina: Created the skeleton for the front-end using React.js and dockerized front end. Additionally, created a rough draft of the database relationships. 
- Fidel Bermudez Jr: Worked with Johnny to create a mock-up of the web application using Figma. Specifically worked on the creation of the welcome screen, the login-in/sign-up page, and the summary/overview page, making sure to highlight the primary features of each page and their usability.
- Israel Briones Jr: Researched the various functions that the API Plaid has available to be used so that the group is able to implement the API seamlessly in order to make Salus’s features work as intended and where it can connect to the front-end/back-end.
- Kelvin Bueno: Set up backend and database and dockerized app
- Johnny Cortez: Created Mockups of features from Milestone 1 on Figma. Specifically, designed the initial mockups of tracker, budget, and bill alert pages. Went into depth of the functionality of each page and how users will interact with them. 

### Milestone 3:

**Summary of Progress:**
- Nicole Romero Ospina: Worked on the savings page of the app. I implemented a button that allows users to add a new savings goal, and then see that goal displayed. Backend request: POST a new goal to the savings table, GET goals for a specific user from the savings table.
- Fidel Bermudez Jr: Worked on the transactions page of the app. I used a GET request to retrieve the data from the backend, specifically, from the expenses and income collections (tables). Also, I implemented a route that specifies the expenses and income based on the user (using user_id), which was shown in our demo. Furthermore, I used a toggle button to let the user switch between the income table and the expenses table at ease.
- Israel Briones Jr: I worked on the budget page of the app. Using a GET request, I was able to call the budget table in the backend so that the user could view all of the budgets created. I also implemented a fetch button that is able to showcase a single budget based on the input of a budget ID.
- Kelvin Bueno: Set up user login implementation using a POST request  that on successful verification, the user is able to see their bank account information using a GET request.
- Johnny Cortez: created financial reports (summary) page. Fetched currently logged in user data from categories and budget collections using get requests then joined, grouped, and aggregated data by month and year to see user budget history in a bar graph.


**Feature location in code:**

Backend:
- All routes: ~/server/routes/
- Schema: ~/server/models
- DB connection: ~/server/server.js

Frontend: 
- Features: ~/client/src/pages/
** all files in pages except home.jsx and user.jsx




