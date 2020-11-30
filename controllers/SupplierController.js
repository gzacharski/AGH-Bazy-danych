const driver = require('../config/dbconfig').driver;
const config = require('../config/dbconfig').config;
const uuid = require('uuid');

module.exports.createById=async (request, response) => {
    console.log('Create supplier...');
}

module.exports.getById=async (request, response) => {
    console.log('Get supplier by Id...');
}

module.exports.updateById=async (request, response) => {
    console.log('Update supplier by Id...');
}

module.exports.deleteById=async (request, response) => {
    console.log('Delete supplier by Id...');
}

module.exports.getAll=async (request, response) => {
    console.log('Get all supplies...');
}