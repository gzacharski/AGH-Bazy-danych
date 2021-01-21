const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../../app");
const { isEqual } = require('lodash');
const { expect } = chai;

chai.use(chaiHttp);

const timeout = Number.parseInt(2000);

let productID, createdProduct, firstSupplierID;

let product = {
    unitPrice: 0.0,
    unitsInStock: 39,
    reorderLevel: 10,
    name: "Chai",
    quantityPerUnit: "10 boxes x 20 bags",
    discontinued: 0,
    unitsOnOrder: 0
}

let categories = [
    { name: "Category1", description: "Category1 description" },
    { name: "Category2", description: "Category2 description" },
    { name: "Category3", description: "Category3 description" },
    { name: "Category4", description: "Category4 description" },
]

let supplier={
    country: "Poland",
    address: "49 Gilbert St.",
    contactTitle: "Purchasing Manager",
    city: "Warsaw",
    phone: "(171) 555-2222",
    contactName: "Charlotte Cooper",
    postalCode: "EC1 4SD",
    companyName: "Exotic Liquids"
}

//*********
//BeforeAll
//*********
describe("Create new categories in order to test crud of product", () => {
    categories.forEach(category=>
        it("Should create new category in database", done => {
            chai
                .request(app)
                .post("/api/categories")
                .send(category)
                .end((err, res) => {
                    expect(res.statusCode).to.be.oneOf([200, 201]);
                    expect(res.body).to.have.property("id");
                    expect(res.body).to.have.property("name");
                    expect(res.body).to.have.property("description");
                    expect(res.body.name).to.deep.equal(category.name);
                    expect(res.body.description).to.deep.equal(category.description);
                    category.id = res.body.id;
                    done();
                });
        }).timeout(timeout)
    );
});

//*********
//BeforeAll
//*********
describe("Create new supplier in order to test crud of product",()=>{
    it("Should create new supplier in database", done=>{
        chai
            .request(app)
            .post("/api/suppliers")
            .send(supplier)
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("companyName");
                supplier.id=res.body.id;
                firstSupplierID=res.body.id;
                expect(isEqual(res.body,supplier)).to.be.true;
                done();
            });
    }).timeout(timeout);
});


describe("Create new product",()=>{
    it("Should create new product in database", done=>{
        chai
            .request(app)
            .post("/api/products")
            .send({
                product,
                supplier,
                categories
            })
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property('supplier');
                expect(res.body).to.have.property("categories");
                expect(res.body).to.have.property("product");

                let tempProduct={
                    reorderLevel: { low: product.reorderLevel, high: 0 },
                    unitPrice: product.unitPrice,
                    unitsInStock: { low: product.unitsInStock, high: 0 },
                    name: product.name,
                    id: res.body.product.id,
                    discontinued: { low: product.discontinued, high: 0 },
                    quantityPerUnit: product.quantityPerUnit,
                    unitsOnOrder: { low: product.unitsOnOrder, high: 0 }
                };
                productID=Number.parseInt(res.body.product.id.low);

                expect(isEqual(res.body.supplier,supplier)).to.be.true;
                expect(isEqual(res.body.product,tempProduct)).to.be.true;
                expect(isEqual(res.body.categories,categories)).to.be.true;
                createdProduct=res.body.product;
                done();
            });
    }).timeout(timeout);
});

describe("Get product by ID",()=>{
    it("Should get product by ID from database", done=>{
        chai
            .request(app)
            .get(`/api/products/${productID}`)
            .send()
            .end((err, res) => {
                
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property('supplier');
                expect(res.body).to.have.property("categories");
                expect(res.body).to.have.property("product");
                expect(Number.parseInt(res.body.product.id.low)).to.deep.equal(productID);

                expect(isEqual(res.body.supplier,supplier)).to.be.true;
                expect(isEqual(res.body.product,createdProduct)).to.be.true;
                expect(
                    isEqual(
                        res.body.categories.sort((cat1,cat2)=>cat1.name.localeCompare(cat2.name)),
                        categories
                    )
                ).to.be.true;
                
                done();
            });
    }).timeout(timeout);
});

supplier={
    country: "Germany",
    address: "49 Gilbert St.",
    contactTitle: "Purchasing Manager",
    city: "Berlin",
    phone: "(171) 555-2222",
    contactName: "Charlotte Cooper",
    postalCode: "EC1 4SD",
    companyName: "Exotic Liquids"
}

//*********
//BeforeTestingUpdate
//*********
describe("Create new supplier in order to test update of product",()=>{
    it("Should create new supplier in database", done=>{
        delete supplier.id;
        chai
            .request(app)
            .post("/api/suppliers")
            .send(supplier)
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("companyName");
                supplier.id=res.body.id;
                expect(isEqual(res.body,supplier)).to.be.true;
                done();
            });
    }).timeout(timeout);
});

describe("Update product by ID",()=>{
    it("Should update product by ID from database", done=>{
        const updatedCategories = categories.slice(0,2);
        product.unitsInStock=40,
        product.reorderLevel=11,
        product.name="Test",

        chai
            .request(app)
            .put(`/api/products/${productID}`)
            .send({
                product,
                supplier,
                categories: updatedCategories
            })
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200,201]);
                expect(res.body).to.have.property('supplier');
                expect(res.body).to.have.property("categories");
                expect(res.body).to.have.property("product");

                let tempProduct={
                    reorderLevel: { low: product.reorderLevel, high: 0 },
                    unitPrice: product.unitPrice,
                    unitsInStock: { low: product.unitsInStock, high: 0 },
                    name: product.name,
                    id: res.body.product.id,
                    discontinued: { low: product.discontinued, high: 0 },
                    quantityPerUnit: product.quantityPerUnit,
                    unitsOnOrder: { low: product.unitsOnOrder, high: 0 }
                };
                productID=Number.parseInt(res.body.product.id.low);
                
                expect(isEqual(res.body.supplier,supplier)).to.be.true;
                expect(isEqual(res.body.product,tempProduct)).to.be.true;
                expect(isEqual(res.body.categories,updatedCategories)).to.be.true;
                createdProduct=res.body.product;
                done();
            });
    }).timeout(timeout);
});

//*********
//AfterTestingUpdate
//*********
describe("Delete supplier by ID",()=>{
    it("Should delete supplier by ID from database", done=>{
        const supplierID=Number.parseInt(supplier.id.low);
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


describe("Delete product by ID",()=>{
    it("Should delete product by ID from database", done=>{
        chai
            .request(app)
            .delete(`/api/products/${productID}`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([200]);
                expect(res.body).to.have.property("id");
                expect(res.body).to.have.property("message");
                expect(Number.parseInt(res.body.id)).to.deep.equal(productID);
                expect(res.body.message).to.deep.equal("Product has been deleted.");
                done();
            });
    }).timeout(timeout);

    it("Should try to delete non-existing product by ID from database", done=>{
        chai
            .request(app)
            .delete(`/api/products/${productID}`)
            .send()
            .end((err, res) => {
                expect(res.statusCode).to.be.oneOf([404]);
                expect(res.body).to.have.property("message");
                expect(res.body.message).to.deep.equal(`There is no product with provided id: ${productID}`);
                done();
            });
    }).timeout(timeout);
});

describe("Try get product by ID which doesn't exist",()=>{
    it("Should try get product by ID from database which doesn't exist", done=>{
        chai
            .request(app)
            .get(`/api/products/${productID}`)
            .send()
            .end((err, res) => {
                
                expect(res.statusCode).to.be.oneOf([404]);
                expect(res.body).to.have.property('message');
                expect(
                    isEqual(
                        res.body.message,
                        `There is no product with provided id: ${productID}`
                    )
                ).to.be.true;
        
                done();
            });
    }).timeout(timeout);
});


//*********
//AfterAll
//*********
describe("Delete supplier by ID",()=>{
    it("Should delete supplier by ID from database", done=>{
        const supplierID=Number.parseInt(firstSupplierID.low);
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

//*********
//AfterAll
//*********
describe("Delete created categories",()=>{
    categories.forEach(category=>
        it("Should delete category by ID from database", done=>{
            const categoryID=Number.parseInt(category.id.low);
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
        }).timeout(timeout)
    );
});