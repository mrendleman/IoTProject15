To install required dependencies on your Raspberry Pi, make sure your software is up-to-date first:

sudo apt update

sudo apt upgrade

sudo apt-get update

sudo apt-get upgrade


To prepare the node environment, use commands from Lab02:

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

sudo apt install -y nodejs


Node dependencies: All Pis will need:

npm install firebase


If you are using senseHAT, you will need:

npm install @trbll/nodeimu

npm install @trbll/sense-hat-led


If you are using an LED, set up your physical circuit as described in this guide: https://www.w3schools.com/nodejs/nodejs_raspberrypi_blinking_led.asp

Basically, your led will be controlled by the fourth pin in the left column, the ground being the 5th pin in that column, and you'll need a resistor or two to ensure the LED doesn't burn out. You're ECE peeps so this won't be too hard.

Then, we'll need one last node module:

npm install onoff


From there, your pi should be good to go.
