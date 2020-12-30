const {google} = require('googleapis');
const keys = require('./Rating-keys.json');
const axios = require('axios').default;

const tvShowsUrl = 'http://api.tvmaze.com/search/shows?q=friends'
const spreadSheetsId = '1QQq0kBNvmiVdcZfZt4K3aGtFtQUFQlDV7fOX4nuv1zk'
const spreedSheetsUrl = 'https://www.googleapis.com/auth/spreadsheets'

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    [spreedSheetsUrl]
);

class ShowResult {
    constructor(name, status, rating, officialSite, summary) {
        this.name = name;
        this.status = status;
        this.rating = rating;
        this.officialSite = officialSite;
        this.summary = summary;
    }
}

let createShowResults = (res) => {
    return res.data
        .map((el) => el.show)
        .map(parseShowResult);
}

let sortShowResults = (results) => {
    let compare = (a, b) => {
        return (b.rating || 0) - (a.rating || 0);
    };

    return results.sort(compare);
}

let parseShowResult = (resultItem) => {
    return new ShowResult(resultItem.name,
        resultItem.status,
        resultItem.rating.average,
        resultItem.officialSite,
        resultItem.summary);
}

let createMatrix = (items) => {
    const itemRows = [];
    if (items.length > 0) {
        itemRows.push(Object.keys(items[0]));
    }

    for (var item of items) {
        var itemCols = [];
        for (var field of Object.keys(item)) {
            itemCols.push(item[field]);
        }

        itemRows.push(itemCols);
    }

    return itemRows;
}

const updateGoogleSheets = (items) => {
    const googleSheetMatrix = createMatrix(items);
    const gsapi = google.sheets({version:'v4', auth: client});

    let range1 = `A1:${googleSheetMatrix[0].length}${googleSheetMatrix.length}`;
    const updateData = {
        spreadsheetId: spreadSheetsId,
        range: range1,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: googleSheetMatrix
        }
    };

    return gsapi.spreadsheets.values.update(updateData);
};

axios.get(tvShowsUrl)
    .then(createShowResults)
    .then(sortShowResults)
    .then(updateGoogleSheets)
    .then(() => console.log("success!"))

module.exports.ShowResult = ShowResult;
module.exports.sortShowResults = sortShowResults;