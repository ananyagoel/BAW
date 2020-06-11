'use strict';

const request = require("./requestHandler");
const stationUtils = require("./stationUtils");
const tripUtils = require("./tripUtils");
const transferUtils = require("./transfersUtils");
const URL = "https://stage.bookaway.com/api/";

class BAW {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.expiryepoch = 0
    }

    get token() {
        return (async () => {
            if ((new Date).getTime() >= this.expiryepoch) {
                await this.getAccessToken();
            }
            return this.accessToken
        })();
    }

    set token(value) {
        this.accessToken = value
    }

    set expiry(value) {
        this.expiryepoch = (new Date).getTime() + parseInt(value)*1000 //seconds to milliseconds
    }

    get tripData() {
        return this.trips
    }

    set tripData(value) {
        this.trips = value
    }

    get cheapestData() {
        return this.cheapest
    }

    set cheapestData(value) {
        return this.cheapest = value
    }

    get creditData() {
        return (async () => {
            if (this.credits === undefined) {
                await this.getCredit()
            }
            return this.credits
        })()
    }

    set creditData(value) {
        this.credits = parseInt(value)
    }

    get stationsData() {
        return (async () => {
            if (this.stations === undefined) {
                await this.getStations()
            }
            return this.stations
        })();
    }

    set stationsData(value) {
        this.stations = value
    }

    get bookingData() {
        return this.booking
    }

    set bookingData(value) {
        this.booking = value
    }

    get bookingConfirmedData() {
        return this.bookingStatus
    }

    set bookingConfirmedData(value) {
        this.bookingStatus = value
    }

    async getAccessToken() {
        const {data} = await request.post(`${URL}auth/v1/oauth/token`, {
            "client_id": this.clientId,
            "client_secret": this.clientSecret,
            "scope": "b2b",
            "grant_type": "client_credentials"
        });
        this.token = data.access_token
        this.expiry = data.expires_in
    }

    async getStations() {
        const {data} = await request.get(`${URL}b2b/v1/stations`, {
            headers: {Authorization: `Bearer ${await this.token}`}
        });
        this.stationsData = data
    }

    async getStationCount(stationName) {
        const count = await stationUtils.getIds(await this.stationsData, stationName);
        return count.length
    }

    async getTrips(dateString, passengers, arrival, departure) {
        const departureIds = await stationUtils.getIds(await this.stationsData, arrival)
        const arrivalStationIds = await stationUtils.getIds(await this.stationsData, departure)
        const {data} = await request.get(`${URL}b2b/v1/trips`, {
            params: {
                passengers: passengers,
                departure: dateString,
                arrivalStation: arrivalStationIds.toString(),
                departureStation: departureIds.toString()
            },
            headers: {Authorization: `Bearer ${await this.token}`}
        })
        this.tripData = data.data
        return data
    }

    async getCredit() {
        const {data} = await request.get(`${URL}b2b/v1/credits`, {
            headers: {Authorization: `Bearer ${await this.token}`}
        })
        this.creditData = data.balance
        return this.credits
    }

    async getExtraInfo(){
        const {data} = await request.get(`${URL}b2b/v1/transfers`,{
            headers: {Authorization: `Bearer ${await this.token}`}
        })
        return await transferUtils.extraInfo(data,this.cheapest.transferId)
    }

    async bookCheapestTrip(firstName, lastName, email, phone) {
        const cheapestTrip = await tripUtils.getCheapest(this.trips);
        if (cheapestTrip) {
            this.cheapestData = cheapestTrip;
            const extraInfo = await this.getExtraInfo();
            const {data} = await request.post(`${URL}b2b/v1/bookings`, {
                tripId: cheapestTrip.id,
                passengers: [
                    {
                        firstName: firstName,
                        lastName: lastName,
                        extraInfos: extraInfo
                    },
                ],
                contact: {
                    email: email,
                    phone: phone
                },
                extraOptions: []
            }, {
                headers: {Authorization: `Bearer ${await this.token}`}
            });
            this.bookingData = data;
            return data.reference
        } else {
            return "no trip matches the criteria"
        }
    }

    async payForBooking() {
        const {data} = await request.post(`${URL}b2b/v1/bookings/${this.booking.id}/pay`, {}, {
            headers: {Authorization: `Bearer ${await this.token}`}
        });
        await this.getCredit()
        return data.reference;
    }

    async getBookingStatus() {
        const {data} = await request.get(`${URL}b2b/v1/bookings/${this.booking.id}`, {
            headers: {Authorization: `Bearer ${await this.token}`}
        })
        this.bookingConfirmedData = data.status
        return this.bookingConfirmedData
    }
}

module.exports= BAW;
