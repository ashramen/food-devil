# 🍽️ Food Devil 💙
This is our repo for the CS316 semester project. Food Devil is a tool for students to explore Duke Dining's offerings and maintain a healthy diet.

Features include: 
* Nutritional database of dining locations
* Diet tracking
* Campus feed
* Meal recommendations
* On and off-campus food reviews

Our tech stack: MERN (React on frontend, Node on backend, MongoDB for database).

This is the frontend repo. Our backend repo is here: https://github.com/bluqiu001/food-devil-backend

# Running the App
After you `cd` into the root folder, run `npm install` to install all dependencies, followed by `npm start` to run the app.

You can now test the log in page by creating an account and logging in.

To test other API routes, first log in and open the console on the home page. Then follow the instructions in `src/components/nutritionReport/nutritionReport.tsx` starting at line 67. You also want to open MongoDB cloud to keep track of the database changes.
