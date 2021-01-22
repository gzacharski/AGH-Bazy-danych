const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("Get all Supplies relationships", () => {
    it("Should get All Supplies relationships", done => {
        chai
            .request(app)
            .get("/api/suppliers/products/all")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get all Products which are supplied by Supplier", () => {
    let validSupplierId = 1;
    it("Should get Suppliers which supply the existing Product", done => {
        chai
            .request(app)
            .get("/api/suppliers/"+validSupplierId+"/products")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    }).timeout(5000);
});

describe("Get all Supplies which supply Product", () => {
    let validProductId = 25;
    it("Should get Suppliers which supply the existing Product", done => {
        chai
            .request(app)
            .get("/api/products/"+validProductId+"/suppliers")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    }).timeout(5000);
});


describe("Get Supplies Relationships by specific Supplier and Product (existing relationship)", () => {
    //existing relationship for following parameters
    let validSupplierId = 11;
    let validProductId = 25;
    it("Should get Supplies relationships for valid request", done => {
        chai
            .request(app)
            .get("/api/suppliers/"+validSupplierId+"/products/"+validProductId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});