async function extraInfo(transfers, transferId) {
    const filteredTransfer = await transfers.find(transfer => transfer.id === transferId);
    return filteredTransfer.passengerExtraInfos.map((info) => {
        return {
            definition: info.id,
            value: info.type === "list"?info.data[0]:info.type === "number"?"25":""
        }
    });
}

module.exports={
    extraInfo
};
