module.exports.test=async (request, response) => {

    response
        .status(200)
        .send(request.body);
}