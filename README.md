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
- Fidel Bermudez Jr: Worked on the transactions page of the app. Implemented an ‘Add expense’ and ‘Add income’ button/feature to the page, which will use a POST request to input the data into the database. Also added a route (incrementAmount) to category so that when you add an expense, it will match based on user_id, category_name, month, and year, and increment the amount spent for that budget. Also added a feature so you can upload a CSV file and it will automatically detect if it is for income or expenses based on the format of the headers, and it will only push to the database if it has all of the needed information. Additionally, you can now sort the table by Date, Amount, and Category. You are also able to filter the expenses and income by date. Lastly, I removed the toggle button that originally switched between the income and expenses table and added two buttons that will display their respective tables.
- Israel Briones Jr: I worked on the budget page of the app. Using a GET request, I was able to call the budget table in the backend so that the user could view all of the budgets created. I also implemented a fetch button that is able to showcase a single budget based on the input of a budget ID.
- Kelvin Bueno: User is able to login and make a new user with validation of user entries. I was able to keep user authentication throughout pages without losing validation and lose user access. There is also new css throughout the website. Also worked on a new website design.
- Johnny Cortez: Filtered the bar graph using a new route getting userdata based on year to allow users to see their budget summary for a given year sorted from January to December. Additionally, users can see if they are going over their montly budget limit based on a red barchart fill. Implemented a piechart to allow users to see a visualiation of their category expense breakdown for a given month using a new route fetching data based on year and month. In total, created two new routes for the cateogry collection. For future work, I need to convert styling from pixels to precentages and create saving summary graph.



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

- Milestone 3: https://www.loom.com/share/42c9fb37931946b7ba443213b47138db?sid=db880902-7b06-41e2-802f-bbcb178ab9f7 
- Milestone 4: https://www.loom.com/share/968187bbce674cf196052c9d0caa1e90?sid=c514292c-5ebe-4471-8816-882737a64294
