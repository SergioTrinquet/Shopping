module.exports = (err, req, res, next) => {
    res
        .status(err.status || 500)
        .json({ 
            titre: err.customMsg, 
            message: err.message, 
            stack: err.stack 
        });
}