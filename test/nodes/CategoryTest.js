const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../../app");
const { isEqual } = require('lodash');
const { expect } = chai;

chai.use(chaiHttp);

const timeout=Number.parseInt(2000);

let categoryID=undefined;

const category={
    name: "CategoryTest",
    description: "CategoryDescription"
}

describe("Create new category",()=>{
    it("Should create new category in database", done=>{
        chai
            .request(app)
            .post("/api/categories")
            .send(category)
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("name");
                expect(res.body).to.have.property("description");
                expect(res.body.name).to.deep.equal(category.name);
                expect(res.body.description).to.deep.equal(category.description);
                categoryID=Number.parseInt(res.body.id);
                done();
            });
    }).timeout(timeout);
});

describe("Get category by ID",()=>{
    it("Should get category by ID from database", done=>{
        chai
            .request(app)
            .get(`/api/categories/${categoryID}`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("name");
                expect(res.body).to.have.property("description");
                expect(res.body.id).to.deep.equal(categoryID);
                expect(res.body.name).to.deep.equal(category.name);
                expect(res.body.description).to.deep.equal(category.description);
                done();
            });
    }).timeout(timeout);
});

describe("Update category by ID",()=>{
    it("Should update category in database by ID", done=>{
        
        const updatedCategory={
            name: "CategoryTest",
            description: "CategoryDescription",
            testproperty: "Testproperty"
        }

        chai
            .request(app)
            .put(`/api/categories/${categoryID}`)
            .send(updatedCategory)
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.ownPropertyDescriptor("id");
                expect(res.body).to.have.property("name");
                expect(res.body).to.have.property("description");
                expect(res.body).to.have.property("testproperty");
                expect(res.body.id).to.deep.equal(categoryID);

                delete res.body.id;
                expect(isEqual(res.body,updatedCategory)).to.be.true;
                done();
            });
    }).timeout(timeout);
});

describe("Get all categories",()=>{
    it("Should get all categories from database", done=>{
        chai
            .request(app)
            .get(`/api/categories`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("quantity");
                expect(res.body).to.have.property("nodes");
                expect(res.body.quantity).to.be.greaterThan(0);
                expect(res.body.nodes.filter(node => (
                        node.hasOwnProperty('name') 
                        && node.hasOwnProperty('description')
                        && node.hasOwnProperty('id'))
                    ).length
                ).to.be.equal(Number.parseInt(res.body.quantity));
                done();
            });
    }).timeout(timeout);
});

describe("Delete category by ID",()=>{
    it("Should delete category by ID from database", done=>{
        chai
            .request(app)
            .delete(`/api/categories/${categoryID}`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("message");
                expect(Number.parseInt(res.body.id)).to.deep.equal(categoryID);
                expect(res.body.message).to.deep.equal("Category has been deleted.");
                done();
            });
    }).timeout(timeout);
});