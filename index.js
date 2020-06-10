'use strict';

const BAW = require('./tasks');

const chalk = require("chalk");
const log = console.log;

async function test() {
    try {
        log(chalk.red.bold("Welcome to BAW script"));

        /*
        BAW class object is created. It sets the clientID and clientSecret in the constructor
         */
        const baw = new BAW("r9VlPfHk0MEx7Mfw+izyei+E0ZUhfkghqGgv2Zeb+H4=", "ef7ac57cc66a42b5efd695e058d1fdd1AidDbU82jomHcISlVSOwBSAxQvG7KKwuEcWREBBISh0=");
        let token = await baw.token;

        /*
        outputs token value
         */
        log(chalk.green.bold.underline("access token is:"));
        log(chalk.blue(token));

        /*
        fetches /stations from the BAW API only once. Filters the count with city as Hanoi and Sapa
         */
        log(chalk.green.bold.underline("Number of stations from Hanoi: "));
        log(chalk.blue(await baw.getStationCount("Hanoi")));

        log(chalk.green.bold.underline("Number of stations from Sapa:"));
        log(chalk.blue(await baw.getStationCount("Sapa")));

        /*
        Finds all the trip departing from Hanoi and ending at Sapa
         */
        await baw.getTrips("2020-08-12", 2, "Sapa", "Hanoi");
        log(chalk.green.bold.underline("Number of trips:"));
        log(chalk.blue( await baw.tripData.length));

        /*
        Prints current credit in the user's account
         */
        log(chalk.green.bold.underline("Current credits:"));
        log(chalk.blue(await baw.creditData));

        /*
        Finds the cheapest trip which is available and has instant confirmation.
         */
        await baw.bookCheapestTrip("john", "Doe", "johndoe@gmail.com", "+1 (234) 556-6677")
        if (baw.cheapestData) {
            /*
            If there is any trip that matches that criteria then it moves ahead and print booking reference
             */
            log(chalk.green.bold.underline("Booking reference:"));
            log(chalk.blue(await baw.bookingData.reference));

            /*
            Prints the credit status before paying
             */
            log(chalk.green.bold.underline("Current credits (before paying):"));
            log(chalk.blue(await baw.creditData));

            /*
            Performs pay booking action to complete booking
             */
            log(chalk.green.bold.underline("Booking response:"));
            // log(chalk.blue(await baw.payForBooking));

            /*
            Prints the credit status after paying
             */
            log(chalk.green.bold.underline("Current credits (after paying):"));
            log(chalk.blue(await baw.creditData));

            /*
            Retries the booking status until the status becomes approved
             */
            let id = setTimeout(async function run() {
                log(chalk.yellow.bold.underline("Timeout exceeded but booking not approved"));
                clearInterval(sid)

            }, 120000);
            let sid = setInterval(async () => {
                if (await baw.getBookingStatus() === "approved") {
                    log(chalk.yellow.bold.underline("Timeout exceeded but booking not approved"));
                    clearTimeout(id)
                    clearInterval(sid)

                } else {
                    log(chalk.red("retrying"));
                }
            }, 5000)
        } else {
            /*
            Prints if no search criteria matches the trip.
             */
            log(chalk.yellow.bold("no trip matches the criteria"))
        }


    } catch (e) {
        console.error(e)
    }
}

test();
