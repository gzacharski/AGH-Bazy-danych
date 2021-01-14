const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("Get all Belongs To relationships", () => {
    it("Should get All Belongs To relationships", done => {
        chai
            .request(app)
            .get("/api/products/categories/all")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get Belongs To Relationships by specific Product and Category when valid request", () => {
    //existing relationship for following parameters
    const validProductId = 25;
    const validCategoryId = 3;
    it("Should get Belongs To relationships for valid request", done => {
        chai
            .request(app)
            .get("/api/products/"+validProductId+"/categories/"+validCategoryId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});


describe("Create and delete Belongs To relationship", () => {
    let productId = null;
    const categoryId = 1;
    //then
    const productName = "testProduct"
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

    it("Should create Belongs To relationship when valid request", done => {
        chai
            .request(app)
            .post("/api/products/"+productId+"/categories/"+categoryId)
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it("Should delete Belongs To relationship when valid request", done => {
        chai
            .request(app)
            .delete("/api/products/"+productId+"/categories/"+categoryId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});
