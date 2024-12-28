1. initialize the empty node project

=>npm init or npm init --y

2. npm i -D typescript nodemon ts-node @types/node

these are dev dependency used in development phase
=> ts-node => is used for running typescript through node and (@types/node)=> also its type declaration or types definition

3. npx tsc --init => this is for typescript compiler and will generate the config file

4. add start script or dev script for
   "dev":"nodemon server.ts"

5. setting up the eslint
   npm init @eslint/config

6. setup prettier => create a file named as .prettierrc.json and there you can define the rules for formatting the code .

7. install express and its types definition

npm i express then npm i -D @types/express

8. install dotenv => npm i dotenv and also
   npm i -D @types/dotenv

9. also install mongooose for interacting with Mongodb

10. create a src folder => create app.ts here we will only setup the server using express
