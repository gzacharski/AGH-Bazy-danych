const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("Get all Contains relationships", () => {
    it("Should get All Contains relationships", done => {
        chai
            .request(app)
            .get("/api/orders/products/all")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get Products contained in Order", () => {
    let validOrderId = 34560;
    it("Should get All Contains relationships", done => {
        chai
            .request(app)
            .get("/api/orders/"+validOrderId+"/products")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get Orders which contain Product", () => {
    let validProductId = 2;
    it("Should get All Contains relationships", done => {
        chai
            .request(app)
            .get("/api/products/"+validProductId+"/orders")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get Contains relationship by ID", () => {
    let validContainsRelationshipId = 3;
    let invalidContainsRelationshipId = 9999999;
    it("Should Contains relationship when ID valid", done => {
        chai
            .request(app)
            .get("/api/products/"+validContainsRelationshipId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("name")
                done();
            });
    });

    it("Should return 404 when Contains relationship ID nonexistent", done => {
        chai
            .request(app)
            .get("/api/products/"+invalidContainsRelationshipId)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});

var validContainsRelationshipId = 99998;
describe("Create Contains relationship", () => {
    let validOrderId = 34560;
    let validProductId = 2;
    it("Should create Contains relationship when valid request", done => {
        chai
            .request(app)
            .post("/api/orders/"+validOrderId+"/products/"+validProductId)
            .send({
                "odId": validContainsRelationshipId,
                "unitPrice" : 15.89,
                "quantity" : "6",
                "discount" : "11.5"
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(10000);
});

describe("Update Contains relationship", () => {
    it("Should delete Contains relationship when valid request", done => {
        chai
            .request(app)
            .put("/api/orders/products/"+validContainsRelationshipId)
            .send({
                "odId":validContainsRelationshipId,
                "unitPrice" : 15.89,
                "quantity" : "6",
                "discount" : "11.5"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    }).timeout(10000);
});

describe("Delete Contains relationship", () => {
    it("Should update Contains relationship when valid request", done => {
        chai
            .request(app)
            .delete("/api/orders/products/"+validContainsRelationshipId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe("Delete all Contains relationship between Order and Product", () => {
    let validOrderId = 34560;
    let validProductId = 10;
    before(function (done) {
        this.timeout(5000);
        chai
            .request(app)
            .post("/api/orders/"+validOrderId+"/products/"+validProductId)
            .send({
                "odId": validContainsRelationshipId,
                "unitPrice" : 15.89,
                "quantity" : "6",
                "discount" : "11.5"
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });
    it("Should delete Contains all relationships between Order and Product when valid request", done => {
        chai
            .request(app)
            .delete("/api/orders/"+validOrderId+"/products/"+validProductId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});