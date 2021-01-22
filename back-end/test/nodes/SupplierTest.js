const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../../app");
const { isEqual } = require('lodash');
const { expect } = chai;

chai.use(chaiHttp);

const timeout=Number.parseInt(2000);

let supplierID=undefined;

const supplier={
    country: "Poland",
    address: "49 Gilbert St.",
    contactTitle: "Purchasing Manager",
    city: "Warsaw",
    phone: "(171) 555-2222",
    contactName: "Charlotte Cooper",
    postalCode: "EC1 4SD",
    companyName: "Exotic Liquids"
}

describe("Create new supplier",()=>{
    it("Should create new supplier in database", done=>{
        chai
            .request(app)
            .post("/api/suppliers")
            .send(supplier)
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("companyName");
                supplierID=Number.parseInt(res.body.id);

                let tempSupplier=supplier;
                tempSupplier.id=supplierID

                expect(isEqual(res.body,tempSupplier)).to.be.true;
                done();
            });
    }).timeout(timeout);
});

describe("Get supplier by ID",()=>{
    it("Should get supplier by ID from database", done=>{
        chai
            .request(app)
            .get(`/api/suppliers/${supplierID}`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("companyName");

                let tempSupplier=supplier;
                tempSupplier.id=supplierID
                expect(isEqual(res.body,tempSupplier)).to.be.true;
                done();
            });
    }).timeout(timeout);
});

describe("Update supplier by ID",()=>{
    it("Should update supplier in database by ID", done=>{

        const updatedSupplier={
            city: "Kielce",
            testproperty: "TestProperty"
        }

        chai
            .request(app)
            .put(`/api/suppliers/${supplierID}`)
            .send(updatedSupplier)
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("city");
                expect(res.body).to.have.property("testproperty");

                let tempSupplier=Object.assign({},supplier,updatedSupplier);
                tempSupplier.id=supplierID

                expect(isEqual(res.body,supplier)).to.be.false;
                expect(isEqual(res.body,tempSupplier)).to.be.true;
                done();
            });
    }).timeout(timeout);
});

describe("Get all suppliers",()=>{
    it("Should get all suppliers from database", done=>{
        chai
            .request(app)
            .get(`/api/suppliers`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("quantity");
                expect(res.body).to.have.property("nodes");
                expect(res.body.quantity).to.be.greaterThan(0);
                expect(res.body.nodes.filter(node => (
                        node.hasOwnProperty('id') 
                        && node.hasOwnProperty('companyName')
                        && node.hasOwnProperty('contactTitle')
                        && node.hasOwnProperty('contactName')
                    )).length
                ).to.be.equal(Number.parseInt(res.body.quantity));
                done();
            });
    }).timeout(timeout);
});

describe("Delete supplier by ID",()=>{
    it("Should delete supplier by ID from database", done=>{
        chai
            .request(app)
            .delete(`/api/suppliers/${supplierID}`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("message");
                expect(Number.parseInt(res.body.id)).to.deep.equal(supplierID);
                expect(res.body.message).to.deep.equal("Supplier has been deleted.");
                done();
            });
    }).timeout(timeout);
});