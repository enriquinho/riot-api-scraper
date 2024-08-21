# Riot Api League of Legends Match Scraper

## Overview
This is a nodeJS scraper that will fetch matches from the Riot API and store them in a local mongoDB database. 
This is useful as the initial step to run analytics data on them, basically just retrieve them and store them locally in raw JSON document.
This approach can be extended by applying the same pattern to other Riot APIs or by fetching more or different summoners where you want the matches from.

## Features
- Fetches challenger summoners and last 100 matches for each of them, creating a database of +10k matches aproximately
- Has a fetch rate-limit mechanism that supports the limits of a personal API key
- Stores raw data from the response in a local mongoDB in JSON format
- Has TypeScript typing for the supported Riot API methods

## How to use it

### Getting started
- Install [MongoDB Community Server](https://www.mongodb.com/try/download/community) in your computer
- Get a personal [Riot API key](https://developer.riotgames.com)
- Rename the file `.env.example` to `.env` and add your `RIOT_API_KEY` and `MONGODB_URI`
- Install dependencies by running `npm i`
- Setup the database by running `npm run setup-db`
- Start the scraper by runing `npm run start`