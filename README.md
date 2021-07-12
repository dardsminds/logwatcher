# logwatcher
A small web utility to display your selected log file on the website in real time using websocket and NodeJs

![logwatcher screen shot](https://github.com/dariominds/logwatcher/blob/main/logwatcher_screen.png "logwatcher screen")

## Requirements
npm 3.10.10 or latest version

node v6.17.1 or latest version

## Installation
1. clone the repo
2. go inside logwatcher folder
3. install required modules
```
npm install ws
npm install --save-optional bufferutil
npm install --save-optional utf-8-validate@^5.0.2
npm install tail
```
4. this utility runs on port 3000 but you may specify your own desired port, so lets define an apache conf vhost file to proxy pass the utility on default port 80 from local port 3000. Create a configuration file websocket.conf at /etc/httpd/vhost.d/

*websocket.conf*
```
<VirtualHost	*:80>
	ServerName websocket.domain.com

	RewriteEngine on
	RewriteCond ${HTTP:Upgrade} websocket [NC]
	RewriteCond ${HTTP:Connection} upgrade [NC]
	RewriteRule .* "ws://localhost:3000/$1" [P,L]

        ProxyPass /  ws://localhost:3000/
        ProxyPassReverse /  ws://localhost:3000/

	ProxyRequests off
</VirtualHost>
```
note: just put your exact domain name on the ServerName option

5. For the logwatcher index.html file you can either create a virtual host for that or create a folder on your existing site and just make a soft link to it, assuming your public file is located in /public_html  then create a folder logwatcher on it then go inside that newly created folder logwatcher and make a system link file

```
ln -s ../../logwatcher/index.html index.html
```

6. Go to the main file of logwatcher and edit the server.js and change the logfile variable value and specify the path of your log file

*server.js*
```
var WebSocketServer = require("ws").Server;
var wsServer = new WebSocketServer({port:3000});

var logfile = "/var/log/httpd/error-log.log";
...
```

## Run the utility
This logwatcher can only be run by root user so you need to be a root user by using a command 
```
sudo su root
```
Go inside the logwatcher folder and run the logwatcher by using the command below
```
node server.js
```

Note: If you got a token error when running node server.js that probably you are using old version of node you may refer the process on upgrading your node here below:

This will instal nvm
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

After installtion just check if nvm is properly installed by using command,
```
command -v nvm
```
if the output show nvm then installation was successful

finally install later version of Node
```
nvm install node
```

And check version
```
node -v
```
