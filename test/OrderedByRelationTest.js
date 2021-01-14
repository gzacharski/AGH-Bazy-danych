const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("Get all Ordered By relationships", () => {
    it("Should get All Ordered By relationships", done => {
        chai
            .request(app)
            .get("/api/orders/customers/all")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get Ordered By Relationships by specific Order and Customer (existing relationship)", () => {
    //existing relationship for following parameters
    let validOrderId = 30049;
    let validCustomerId = 'ALFKI';
    it("Should get Ordered By relationships for valid request (existing relationship)", done => {
        chai
            .request(app)
            .get("/api/orders/"+validOrderId+"/customers/"+validCustomerId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get Ordered By Relationships by specific Order and Customer (not existing relationship)", () => {
    //not existing relationship for following parameters
    let validOrderId = 31177;
    let validCustomerId = 'ALFKI';
    it("Should get Ordered By relationships between valid Order ID and Customer ID (not existing relationship)", done => {
        chai
            .request(app)
            .get("/api/orders/"+validOrderId+"/customers/"+validCustomerId)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe("Create Ordered By relationship", () => {
    //Order has already got Customer
    let validOrderId = 31177;
    let validCustomerId = 'ALFKI';
    it("Should not create Contains relationship when invalid request (Order has already got Customer)", done => {
        chai
            .request(app)
            .post("/api/orders/"+validOrderId+"/customers"+validCustomerId)
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    }).timeout(5000);
});
