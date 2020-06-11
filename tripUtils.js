'use strict';

async function getCheapest(trips) {
    if (!trips.length) {
        return null;
    } else {
        let cheapest = trips[0];
        let i = 0;
        await trips.forEach((trip) => {
            if (trip.isAvailable && trip.isInstantConfirmation && parseFloat(trip.price.totalAmount) < parseFloat(cheapest.price.totalAmount)) {
                cheapest = trip
            }
        })
        if (cheapest.isAvailable && cheapest.isInstantConfirmation) {
            return cheapest
        } else {
            return cheapest;
        }
    }

}

module.exports = {
    getCheapest
};
