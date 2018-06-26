# Blockchain.JS

A simple nodeJS blockchain I use to learn about the features of the technology.

The application supports Wallets, transactions, transaction fees, block mining, Peer-to-peer communication between nodes
and a simple REST API.

Currently, each process of the app is associated with a Wallet.

### prequisites:
* [Vagrant](https://www.vagrantup.com/)
* [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
* [Docker](https://www.docker.com/) (Only if you want to run the container outside the Vagrant box)


## Installation:

1. cd into the project directory and run `vagrant up`
2. SSH into the machine with `vagrant ssh`, then `cd /vagrant/`
3. type `npm install-test`.
4. If all tests ran successfully, you're all set to run the app in development.

## Usage 
Run 

`node ./app`

The following setting can be controlled via environment variables:

* MINING_DIFFICULTY: difficulty of the block mining exercise.
* MINE_RATE: mining rate controlling the expected time of arrival between two blocks.
* INITIAL_BALANCE: Initial balance of each new wallets.
* MINING_REWARD: reward issued to the successful miner of the latest block.
* PEERS: list of peers this node will synchronise to. This must be passed as a single comma separated string. example : 
"ws://localhost:5001,
ws://localhost:5002"
* P2P_PORT
* HTTP_PORT

Please refer to the [config](./config.js) file for the default values.

## API:

* GET /transactions
* POST /transact
* GET /blocks
* GET /public-key
* POST /mine-transactions
* GET /balance



## Credit 

Initial code inspired from the content of the excellent following class:
[Build a Blockchain and a Cryptocurrency from Scratch](https://www.udemy.com/build-blockchain/)
by [David Katz](https://www.udemy.com/user/54cd8dd54e49b/)