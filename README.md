# MTG_Price_Backend

## Description

This project is a the Node.js/Express/MongoDB backend to the MTG_Price project which displays Magic the Gathering card prices.  This will pull the TCG player data directly, store it in the DB, and serve it to the frontend REST API.

### Installation

Requires MongoDB installed with location set to the url parameter in /data/DatabaseConnection.json

Install the dependant node modules:
```
  $ npm install
```

Populate the DB with the base MTG set data with with the following commands (requires internet connection):
```
  $ npm run populate
  $ npm run populateCards
```
The first fetches data of all the MTG sets and the second gets all of card data.

### Development Build and Run

```
  $ npm start
```
