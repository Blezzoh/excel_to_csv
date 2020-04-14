
const getPercentage = (total, part) => {
    const percentage = part / total * 100
    return Number(percentage.toFixed(2))
}

const formatData = data => {
    for (const d of data) {
        d['Money In'] = convertDollarAmount(d['Money In'])
        d['Gross Profit'] = convertDollarAmount(d['Gross Profit'])
    }
    return data
}
const convertDollarAmount = (amountNumber) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountNumber);
}
const makeData = (nLetters, nLLS, nPayingConsumers, nloginPortal, nLoginWithEmailAuth, nLoginWithSmsAuth, moneyIn, grossProfit) => ({
    '# of Letters': nLetters,
    '# of LLS': nLLS,
    '# Paying Consumers': nPayingConsumers,
    '# Portal Login': nloginPortal,
    '% of portal login to paying consumer': getPercentage(nPayingConsumers, nloginPortal),
    '% of calls educated guess(Hayden and Blaise)': 100 - getPercentage(nPayingConsumers, nloginPortal),
    '# Login Via Email': nLoginWithEmailAuth,
    '# Login Via SMS': nLoginWithSmsAuth,
    'Money In': moneyIn,
    'Gross Profit': grossProfit
})
const makeSummary = data => {
    let summary = makeData(0, 0, 0, 0, 0, 0, 0,0)
    for (const d of data) {
        const keys = Object.keys(d);
        for (const key of keys) {
            summary[key] += d[key]
        }
    }
    const percentage = getPercentage(summary['# Paying Consumers'], summary['# Portal Login'])
    summary = {
        ...summary, letter: 'Overall',
        '% of portal login to paying consumer': percentage,
        '% of calls educated guess(Hayden and Blaise)': 100 - percentage
    }
    return summary
}
var getData = () => {
    let data = [
        { letter: "003 - 1st Validation", ...makeData(827257, 4477982, 42784, 10760, 7168, 8467, 10061637, 1445191) },
        { letter: "004 - 2nd Validation", ...makeData(315705, 999044, 5405, 1696, 1046, 1300, 2383453, 523677) },
        { letter: "206 - we want to help", ...makeData(177180, 106865, 2258, 1304, 748, 957, 1190216, 285571) },
        { letter: "236 - Broken Payment", ...makeData(31097, 1665, 319, 91, 55, 71, 139435, 29894) },
        // { letter: "339 - Legal Demand(501R)", ...makeData(10761, 5816, 129, 58, 45, 45, 151847, 44802) },
        // { letter: "332- Legal Demand", ...makeData(11057, 7336, 159, 176, 129, 157, 178407, 65279) },
        { letter: "498 - Electronic ACH Letter", ...makeData(3427, 1036, 665, 175, 168, 86, 75576, 22447) }
    ]
    data = data = [...data, makeSummary(data)]
    return data
}
const data = formatData(getData())
const exportToCsv = (json) => {
    var fields = Object.keys(json[0])
    var replacer = function (key, value) { return value === null ? '' : value }
    var csv = json.map(function (row) {
        return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    return csv
}

console.log(exportToCsv(data))
// console.log(data)

