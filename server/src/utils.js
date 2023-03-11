/**
 * Parse page params into db pagination options
 */
function parsePaginationParams({ offset, limit, sort: sortField } = {}, { sortFields = [] } = {}) {
    offset = offset ? Number(offset) : 0
    limit = limit ? Number(limit) : 20

    // set offset range
    if (offset < 0) offset = 0

    // set limit range
    // if (limit < 20) limit = 20
    if (limit > 100) limit = 100

    const skip = offset * limit

    // if leading dash is present in sort field remove it and change sort order
    let sortOrder = 1
    if (sortField?.startsWith("-")) {
        sortField = sortField.slice(1)
        sortOrder = -1
    }

    // validate sort field, defaults to first sort field
    if (!sortFields.includes(sortField)) {
        sortField = sortFields[0]
    }  

    // only return sort options is sort field is valid
    const sort = sortField ? { field: sortField, order: sortOrder } : null

    return { offset, skip, limit, sort }
}

module.exports = { parsePaginationParams }
