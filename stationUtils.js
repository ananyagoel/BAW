'use strict';

async function getIds(stations, stationName) {
    let filteredStations = await stations.map((station) => {
        if (station.city.city === stationName) {
            return station.stationId
        }
    })
    filteredStations = await filteredStations.filter(Boolean)
    return filteredStations
}


module.exports = {
    getIds
}
