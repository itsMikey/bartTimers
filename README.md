# bartTimers
bartTimers was created so you could be a part time commuter instead of being full time on the wrong trains at the wrong time. You set your home/destination stations and the time you'd like to arrive to each one. It will then alert you with web notifications when your train is near.

## Purpose
We're usually on the computer at work so I thought it would be convenient to have an app to remind us that the BART train is near. Another one of my motivations for creating this was to get familiar with React and Docker.


### Prerequisites
If you'd like to run the code, you'll need the following installed on your machine
```
Node.js
Yarn/NPM
Docker
```
You'll also need a BART api key and you can get one easily [here](http://api.bart.gov/api/register.aspx).
Then replace ```YOUR_API_KEY``` in ```/config/env/common.yml```

### To run the code
To build: <br />
```yarn run build``` <br /> <br />
To run unit tests: <br />
 ``` yarn run test``` <br /> <br />
 After you've compiled the build, bring it up with docker: <br />
 ``` docker-compose -f docker-compose-development.yml up```

### Built With
* Backend: 
  * Node.js
  * Express
  * Inversify (inversion of control container)
* Frontend: 
  * React
  * Bulma
* Config: 
  * Docker Containers
    * App (Node.js)
    * Worker (Node.js)
    * Mongo
    * Nginx

### Screenshots
Dashboard Section
![Dashboard](/git/screenshots/dashboard.png?raw=true "Dashboard image")
<br />
Register/Login Tabs
![Register/Login](/git/screenshots/register-login.png?raw=true "register and login image")
<br />
Web Notification <br />
![Web Notification](/git/screenshots/react-notification.png?raw=true "web notification")

### License
This project is licensed under the MIT License - see the [LICENSE](/LICENSE) for details
