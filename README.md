## Frontend server address

https://xtracker.onrender.com/

## Backend server address and implemented endpoints

https://xtracker.onrender.com/api/

#### Endpoints:

/expenses  
/expenses/{id}  
/expenses/month/{i}  
/expenses/filter?category

## Instructions for running the application locally

`npm install` to install the required packages.  
`npm run start` to start backend and frontend on localhost:5000.  
`npm run dev` for development mode.

## Example SQL statement for creating data

INSERT INTO `expenses` (`date`, `amount`, `category`, `shop`) ´  
VALUES ('2022-12-21', 100.00, 'Ruoka', 'Prisma');
