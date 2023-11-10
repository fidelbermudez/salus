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

### Milestone 4
**Summary of Progress:**
- Nicole Romero Ospina: Worked on the savings page of the app. I implemented buttons for adding goals, editing goals, and deleting goals. I also created modals that display the history of transactions made toward each savings goal. Backend requests: POST a new goal to the savings table, GET goals for a specific user from the savings table, DELETE a goal, UPDATE (PUT) a goal, GET savings history for a specific savings goal, POST new entry in savings history for a goal, UPDATE entry in savings history when the category name changes.
- Fidel Bermudez Jr: Worked on the transactions page of the app. Implemented an ‘Add expense’ and ‘Add income’ button/feature to the page, which will use a POST request to input the data into the database, which will then show on their respective table. Also added a route (incrementAmount) to category so that when you add an expense, it match based on user_id, category_name, month, and year, and increment the amount spent for that budget. I also added a feature so you can upload a CSV file and it will automatically detect if it is for income or expenses based on the format of the headers (you must put ‘income’ or ‘expenses’ as the first headers), and it will only push to the database if it has all of the needed information (I plan on providing a simple demo, or maybe even adding a button where it will give them a blank expense and income csv file, that way they are aware of the format needed for their respective needs). Additionally, you can now sort the table by Date, Amount, and Category. You are also able to filter the expenses and income by date (there is a Start Date and End Date indication of which is which, so the user does not get confused). Lastly, I removed the toggle button that originally switched between the income and expenses table and added two buttons that will display their respective tables (I ensured to make the active table have its button be blue, and other be gray).
- Israel Briones Jr: I worked on the budget page of the app. Using a GET request, I was able to call the budget table in the backend so that the user could view all of the budgets created. I also implemented a fetch button that is able to showcase a single budget based on the input of a budget ID.
- Kelvin Bueno: Set up user login implementation using a POST request  that on successful verification, the user is able to see their bank account information using a GET request.
- Johnny Cortez: created financial reports (summary) page. Fetched currently logged in user data from categories and budget collections using get requests then joined, grouped, and aggregated data by month and year to see user budget history in a bar graph.



**Feature location in code:**

Backend:
- All routes: ~/server/routes/
- Schema: ~/server/models/
- DB connection: ~/server/server.js

Frontend: 
- Features: ~/client/src/pages/
- all files in "/pages/" correspond to demoed features except home.jsx and user.jsx
- files in "/pages/" may contain components that are located in "/components/" (ex: /components/savingsCat contains the savings goal cards).
- navigation bar files located in "/components"
- css files are generally contained in "/styles/"


**Demo Video Link**

Milestone 3: https://www.loom.com/share/42c9fb37931946b7ba443213b47138db?sid=db880902-7b06-41e2-802f-bbcb178ab9f7 
Milestone 4: 
