const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("Create test product", () => {
    it("Should create product", done => {
        chai
            .request(app)
            .get("/api/products")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get all products", () => {
    it("Should get all products", done => {
        chai
            .request(app)
            .get("/api/products")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get product by ID", () => {
    it("Should get product when ID valid", done => {
        chai
            .request(app)
            .get("/api/products/1")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("name")
                done();
            });
    });

    it("Should return 404 when product's ID nonexistent", done => {
        chai
            .request(app)
            .get("/api/products/6666")
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe("Create product", () => {
    it("Should create product when valid request", done => {
        chai
            .request(app)
            .post("/api/products")
            .send({"name":"testProduct"})
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });
});

describe("Update product by ID", () => {
    var id = null;
    const productName = "testProduct"
    before(function (done) {
        chai
            .request(app)
            .post("/api/products")
            .send({"name": productName})
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.name).equals(productName)
                id = res.body.id.low
                done()
            });
    })

    it("Should update product when ID valid", done => {
        const updatedProductName = "testProductV2"
        chai
            .request(app)
            .put("/api/products/" + id)
            .send({"name":updatedProductName})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.id.low).equals(id)
                expect(res.body.name).equals(updatedProductName)
                done();
            });
    });

    it("Should return 404 when product ID not found", done => {
        const invalidId = 9999
        const updatedProductName = "testProductV2"
        chai
            .request(app)
            .put("/api/products/" + invalidId)
            .send({"name":updatedProductName})
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe("Delete product by ID", () => {
    var id = null;
    const productName = "testProduct"
    before(function (done) {
        chai
            .request(app)
            .post("/api/products")
            .send({"name": productName})
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.name).equals(productName)
                id = res.body.id.low
                done()
            });
    })

    it("Should delete product when ID valid", done => {
        chai
            .request(app)
            .delete("/api/products/" + id)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(Number.parseInt(res.body.id)).equals(id)
                expect(res.body.message).equals("Product has been deleted.")
                done();
            });
    });

    it("Should return 404 when product ID not found", done => {
        const invalidId = 9999
        chai
            .request(app)
            .delete("/api/products/" + invalidId)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});