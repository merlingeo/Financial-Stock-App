# Financial-Stock-App

The world has been focusing on stocks and crypto investments since it provides more returns to the capital we invest. The number of people trading on the stock market dramatically expanded, which resulted in the recent creation of numerous stock analysis applications. But a beginner or non-specialist who wants to trade on the stock market finds the current system confusing and overflowing with data. The main aim of this project is to develop a simple tool that provides a clear analysis about stocks through individual stock portfolios and provides financial expert support. The Financial Assistant application, Fin Assist, focuses on day-to-day financial data of the top hundred companies Listed in the London Stock Exchange, known as FTSE100. This web application creates stock portfolios, analyzes their trends in the historical data and helps the user to make decisions to invest accordingly. The methodology used here in this project is the quantitative data analysis of market trends and predict the near future value of the stock. A user can create personalized space by registering and creating a watchlist of favorite stocks to track their daily performance. Users who require extra help selecting the stocks can get professional advice. The well-designed user interface, admin, expert, and stock portfolio sections, share price graphs, and financial expert advice set this application standout in recent similar financial applications. 


SETUP GUIDE


Front end :set up Angular (https://angular.io/guide/setup-local)
Back end : set up Flask (https://flask.palletsprojects.com/en/2.2.x/installation/)


***Copy the stock-app folder and flask-angular folder into the computer.

***Inside the stock app folder . open the cmd and do 'npm i' (npm must be installed in the path to do this action)
after the npm install is complete, do ' npm start' This will start the front end server in local host.(http://localhost:4200/)


***Then to set up the backend server,Python3 must be installed in the system.

***Connect to a MysQL database and change the configuration settings in backend.py. Provide the connection name and the DB name and also the user name and password.
Once DB connection is set up perfectly.


***cd to the directory where requirements.txt is located

***activate your virtualenv (Run the virtual environment for the code.(..path of the project.../env/Scripts/Activate.ps1))

***run: pip install -r requirements.txt in your shell

***in the virtual environment run 'python backend.py'

***If the server runs without any issue, the development server will start on http://127.0.0.1:5000 

*****run http://127.0.0.1:5000/ in browser to fill the sector table

*****run http://127.0.0.1:5000/company in browser to fill the companies table

*****Then run http://127.0.0.1:5000/percentChange'in the browser to update the DB with daily percent value.

***************After all these steps are completed . App is GOOD TO GO! *******************

