const reduce = results => {
    return results.map(x => x)
        .filter(x => !!x)
        .reduce((acc, curr) => ({
            result: Object.assign({}, acc.result, curr.value),
            errors: [...acc.errors, curr.error].filter(x => !!x)
        }), { result: {}, errors: [] });
}

module.exports = {
    combine: reduce
}