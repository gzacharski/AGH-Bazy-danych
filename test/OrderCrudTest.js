const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("Create Product Order", () => {
    const validCustomerId = 'ALFKI';
    const validProductId = 1;
    it("Should create Product Order when valid request", done => {
        chai
            .request(app)
            .post("/api/customers/"+validCustomerId+"/products/"+validProductId)
            .send({
                    "orderDate": "2020-01-01",
                    "requiredDate" : "2020-06-01",
                    "shippedDate" : "2020-01-05",
                    "freight" : 1,
                    "shipName" : "Grdgtr Gdx Ivgjov",
                    "shipAddress" : "Evydnh St. 56",
                    "shipCity" : "Waviyoyim",
                    "shipPostalCode" : "9154-92838",
                    "shipCountry" : "Sweden",
                    "unitPrice" : 20.00,
                    "quantity" : 1,
                    "discount" : 5.5
                })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(15000);
});

describe("Create new Product Order", () => {
    const validCustomerId = 'ALFKI';
    const validProductId = 1;
    it("Should create new Product Order when valid request", done => {
        chai
            .request(app)
            .post("/api/orders")
            .send({
                "customerId": validCustomerId,
                "productId": validProductId,
                "orderDate": "2020-01-01",
                "requiredDate" : "2020-06-01",
                "shippedDate" : "2020-01-05",
                "freight" : 1,
                "shipName" : "Grdgtr Gdx Ivgjov",
                "shipAddress" : "Evydnh St. 56",
                "shipCity" : "Waviyoyim",
                "shipPostalCode" : "9154-92838",
                "shipCountry" : "Sweden",
                "unitPrice" : 20.00,
                "quantity" : 1,
                "discount" : 5.5
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(15000);
    it("Should not create new Product Order when invalid request (too much stocks in order", done => {
        chai
            .request(app)
            .post("/api/orders")
            .send({
                "customerId": validCustomerId,
                "productId": validProductId,
                "requiredDate" : "2020-06-01",
                "shippedDate" : "2020-01-05",
                "freight" : 1,
                "shipName" : "Grdgtr Gdx Ivgjov",
                "shipAddress" : "Evydnh St. 56",
                "shipCity" : "Waviyoyim",
                "shipPostalCode" : "9154-92838",
                "shipCountry" : "Sweden",
                "unitPrice" : 20.00,
                "quantity" : 10000000,
                "discount" : 5.5
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    }).timeout(15000);
});