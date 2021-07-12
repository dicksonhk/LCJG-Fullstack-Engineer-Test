# LCJG-Fullstack-Engineer-Test
Fullstack engineer interview test for LCJG BetaLabs and you need to finish it within 24 hours.

**Task 1 :**
Follow the steps to setup a mysql database in local
- Install docker desktop and docker-compose (https://www.docker.com/products/docker-desktop)
- Download the [database.zip](https://raw.githubusercontent.com/ayking/LCJG-Backend-Engineer-Test/master/database.zip)
- Run the following command inside the folder to start database ```docker-compose  up --build --force-recreate --renew-anon-volumes db```

**Task 2 :**
You can use any *python* server framwork to implement a simple web server with the following routes (using the database in task 1)
- API 1 - list customers basic details with able to search by first name, last name and order by credit limit
- API 2 - get full customers details by customerNumber
- API 3 - update customers first name, last name and credit limit by customerNumber


**Task 3 :**
Create a single page app by using **Reactjs**, **Angular** or **Vue** to implement the follwing requirements 

- Create a table view to present the result (customerNumber, customerName, addressLine1 + addressLine2, country, creditLimit) from API 1

![Row](https://github.com/ayking/LCJG-Fullstack-Engineer-Test/blob/main/demo%20row.png?raw=true)
- Present the details view when click on name field in the record, the detail view should show all the data from API 2
- Allow user to edit the first name and last name in the details view and update it to server 



After you finsih the test please zip them all to a single file and email to alanyu@lcjgroup.com
