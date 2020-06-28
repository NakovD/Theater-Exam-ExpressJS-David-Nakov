Check the .env file to see some specific variables applied to process.env;
There you can see the port which the app uses to start, the environment, the privateKey
for the jwt token and also the DB_Url. I use cloud mongodb(atlas). I think I allowed every 
IP to be able to use my DB, but I'm not 100% sure, so if doesnt work, then try using your cloudDB url;
db_username: nakovD
db_password: ImAlive1998     -> they are in DB_URL in .env, so no need to paste them there. Just in case someth goes wrong.

npm libraires used(check package.json for more info):
dotenv - !!!very important(without it the app wont work or you will have to set the variables yourself) - npm i dotenv 
expressJS - npm install express - back-end service;
express-handlebars - npm i express-handlebars - template engine; 
mongoose - npm i mongoose - DB api;
bcrypt - npm i bcrypt - for decrypting passwords;
cookie-parser - npm i cookie-parser - for using cookies;
jsonwebtoken - npm i jsonwebtoken - for storing cookies;


Additional information: Every route has a try-catch statement, so if the DB fails it will show a default static page;
Validation is done using mongoose validation when creating {entity}. For passwords and usernames/emails there is server side 
validation with a few if statements, so no validating library is used.  


I will upload the exam to github after I finish it without making any more changes(you can check the time/date), so
if you have problem with anything check there: https://github.com/NakovD  Thanks :)

Good luck :)