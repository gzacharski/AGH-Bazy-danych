const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("Get Customer served by Supplier", () => {
    const supplierId = 1;
    const fromDate = '1999-12-01';
    const toDate = '2001-11-01';
    it("Should Get Customer served by Supplier when valid request", done => {
        chai
            .request(app)
            .get("/api/suppliers/"+supplierId+"/customers/"+fromDate+"/"+toDate+"/onequery")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("unique")
                done();
            });
    });
});

describe("Get all Orders of Customer", () => {
    const validCustomerId = 'ALFKI';
    it("Should Get all Orders of Customer when valid request", done => {
        chai
            .request(app)
            .get("/api/orders/customers/"+validCustomerId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});