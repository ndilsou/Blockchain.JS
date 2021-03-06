apt-get -qqy update
apt-get -qqy install apt-transport-https ca-certificates curl software-properties-common nodejs npm

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

apt-get -qqy update
apt-get -qqy install docker-ce

