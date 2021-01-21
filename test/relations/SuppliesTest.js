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

describe("Create and delete Supplies relationship", () => {
    let productId = null;
    const supplierId = 1;
    //when
    const productName = "testProduct2"
    before(function (done) {
        chai
            .request(app)
            .post("/api/products")
            .send({"name": productName})
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.name).equals(productName)
                productId = res.body.id.low
                done()
            });
    })

    //then
    it("Should create Supplies relationship when valid request", done => {
        chai
            .request(app)
            .post("/api/suppliers/"+supplierId+"/products/"+productId)
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    //after
    it("Should delete Supplies relationship when valid request", done => {
        chai
            .request(app)
            .delete("/api/suppliers/"+supplierId+"/products/"+productId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it("Should delete created product before for supplies relationship creation purposes" , done => {
        chai
            .request(app)
            .delete("/api/products/" + productId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
