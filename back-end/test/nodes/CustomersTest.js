const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../../app");
const { isEqual } = require('lodash');
const { expect } = chai;

chai.use(chaiHttp);

const timeout=Number.parseInt(2000);

let customerID=undefined;

const customer={
    country: "Germany",
    address: "Obere Str. 57",
    city: "Berlin",
    phone: "030-0074321",
    postalCode: "12209",
    name: "Jan Kowalski",
    company: "Alfreds Futterkiste",
    title: "Sales Representative",
    fax: "030-0076545"
}

describe("Create new customer",()=>{
    it("Should create new customer in database", done=>{
        chai
            .request(app)
            .post("/api/customers")
            .send(customer)
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("name");
                customerID=res.body.id;

                let tempCustomer=customer;
                tempCustomer.id=res.body.id;

                expect(isEqual(res.body,tempCustomer)).to.be.true;
                done();
            });
    }).timeout(timeout);
});

describe("Get customer by ID",()=>{
    it("Should get customer by ID from database", done=>{
        chai
            .request(app)
            .get(`/api/customers/${customerID}`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("name");

                let tempCustomer=customer;
                tempCustomer.id=customerID;

                expect(isEqual(res.body,tempCustomer)).to.be.true;
                done();
            });
    }).timeout(timeout);
});

describe("Update customer by ID",()=>{
    it("Should update customer in database by ID", done=>{

        const updatedCustomer={
            country: "Poland",
            address: "Obere Str. 57",
            city: "Berlin",
            phone: "030-0074321",
            postalCode: "12209",
            name: "Janek Kowalski",
            company: "Alfreds Futterkiste",
            title: "Sales Representative",
            fax: "030-0076545",
            testproperty: "TestProperty"
        }

        chai
            .request(app)
            .put(`/api/customers/${customerID}`)
            .send(updatedCustomer)
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("name");
                expect(res.body).to.have.property("testproperty");

                let tempCustomer=updatedCustomer;
                tempCustomer.id=customerID;

                expect(isEqual(res.body,customer)).to.be.false;
                expect(isEqual(res.body,updatedCustomer)).to.be.true;
                done();
            });
    }).timeout(timeout);
});

describe("Get all customers",()=>{
    it("Should get all customers from database", done=>{
        chai
            .request(app)
            .get(`/api/customers`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("quantity");
                expect(res.body).to.have.property("nodes");
                expect(res.body.quantity).to.be.greaterThan(0);
                expect(res.body.nodes.filter(node => (
                        node.hasOwnProperty('id') 
                        && node.hasOwnProperty('name')
                        && node.hasOwnProperty('title')
                        && node.hasOwnProperty('company')
                    )).length
                ).to.be.equal(Number.parseInt(res.body.quantity));
                done();
            });
    }).timeout(timeout);
});

describe("Delete customer by ID",()=>{
    it("Should delete customer by ID from database", done=>{
        chai
            .request(app)
            .delete(`/api/customers/${customerID}`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("message");
                expect(res.body.id).to.deep.equal(customerID);
                expect(res.body.message).to.deep.equal("Customer has been deleted.");
                done();
            });
    }).timeout(timeout);
});