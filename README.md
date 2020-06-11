# book A way task

The script perfoms the following actions:

  - Authenticates and fetched access token
  - Gets all the stations from `Hanoi` and prints the count
  - Gets all the stations from `Sapa` and prints the count
  - Searches trips from Hanoi to Sapa for 2 passengers.
  - Prints credit information
  - Books the cheapest trip that has availability and instant confirmation
  - Fetches the booking detail untill the booking is approved (for max 2 minutes) 

### Installation

The script requires [Node.js](https://nodejs.org/) v12+ to run.

Add the .env file to the root. `(shared in the email)`

Install the dependencies and devDependencies and start the server.

```sh
$ cd BAW
$ npm install
$ npm start
```


