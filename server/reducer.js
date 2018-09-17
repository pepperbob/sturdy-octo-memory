const reduce = results => {
    return results.map(x => x.value)
        .filter(x => !!x)
        .reduce((acc, curr) => ({...acc, ...curr}), {});
}

module.exports = {
    combine: reduce
}