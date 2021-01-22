const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("Create Product Order", () => {
    const validCustomerId = 'ALFKI';
    const validProductId = 2
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

describe("Create new Product Order (for one product)", () => {
    const validCustomerId = 'ALFKI';
    const validProductId = 2
    it("Should create new Product Order when valid request", done => {
        chai
            .request(app)
            .post("/api/orders/oneproduct")
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

    it("Should not create new Product Order when invalid request (too much stocks in order)", done => {
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


describe("Create new Product Order (for many products)", () => {
    let orderId = null;
    it("Should create new Order for many Products when valid request", done => {
        chai
            .request(app)
            .post("/api/orders")
            .send({
                "customer": {
                    "country": "Mexico",
                    "address": "Mataderos  2312",
                    "city": "M?xico D.F.",
                    "phone": "(5) 555-3932",
                    "postalCode": "5023",
                    "name": "Antonio Moreno",
                    "company": "Antonio Moreno Taquer?a",
                    "id": "ANTON",
                    "title": "Owner"
                },
                "orderProperties":{
                    "shipCity": "Reims",
                    "freight": 0,
                    "requiredDate": "1996-08-01",
                    "shipName": "Vins et alcools Chevalier",
                    "shipPostalCode": "51100",
                    "shipCountry": "France",
                    "shippedDate": "1996-07-16",
                    "shipAddress": "59 rue de l''Abbaye"
                },
                "orderDetails": [
                    {
                        "productId": 22,
                        "unitPrice": 20.00,
                        "quantity": 0,
                        "discount" : 5.5
                    },
                    {
                        "productId": 23,
                        "unitPrice": 10.99,
                        "quantity": 0,
                        "discount" : 0
                    }
                ]
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                orderId = res.body.orders.id.low;
                done();
            });
    }).timeout(15000);
    //after
    it("Should remove new Order for many Products when valid request", done => {
        chai
            .request(app)
            .delete("/api/orders/"+orderId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }).timeout(15000);

});