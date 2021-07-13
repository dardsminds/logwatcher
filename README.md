# logwatcher
A small server utility to display your selected log file on the website in real time using websocket and NodeJs, this can be use to debug or inspect data on your code on the server side, the log file can either get generated by Apache, PHP, or the server itself, the log output on the web is more readable than doing the tail command on the terminal.

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
NOTE: just put your exact domain name on the ServerName option, also this virtual host config is only for normal http so and will not work on https url but you may
setup config for https if you like.

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
node server
```

## Updating your node to latest version (Optional)

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
## Running logwatcher in background
For some reason you like to run logwatcher on the background so you don't require to have a separate terminal connection for root user and start logwatcher, or it continue run even you disconnected on terminal so you may use PM2, check here below how to use it.

1. Install PM2 (you need to switch to root user mode)
```
npm install pm2 -g
```
2. Run logwatcher using pm2
```
pm2 start node server.js
```

## How to use

Assume you already run the logwatcher on the server, open the logwatcher index.html file on web browser, make sure to edit websocket address specified on the script portion, it will show the status as connection established.

Now on your actual project file you can use the regular error_log method to output the error on the log file, any update on the log file will automatically display on the logwatcher index.html file.

logger usage:
```
error_log(print_r($object, true));
```

## Improve this app
Everyone is invited to contribute and enhance this utility for more feature, feel free to clone and create a branch to merge on master.
