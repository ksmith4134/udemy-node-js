const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
    
    // copy req.query
    const reqQuery = {...req.query};

    // fields to exlcude from filtering matches
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // create query string
    let queryStr = JSON.stringify(reqQuery);

    // create operators like $gt, $gte, etc.
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    // Select fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        // NOTE: we're tacking on select() to the query - the query is really Bootcamp.find().select()
        query = query.select(fields);
    }

    // Sort by field
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        // NOTE: we're tacking on sort() to the query - the query is really Bootcamp.find().sort()
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // the minus sign inverst the sort asc/desc
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();


    query = query.skip(startIndex).limit(limit);

    if(populate){
        query = query.populate(populate);
    }

    // Executing Query
    // depending on code above, query could be Bootcamp.find().select().sort();
    const results = await query;

    // Pagination result
    const pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
}

module.exports = advancedResults;