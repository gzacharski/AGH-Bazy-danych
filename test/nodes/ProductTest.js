const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../../app");
const { isEqual } = require('lodash');
const { response } = require('../../app');
const { expect } = chai;

chai.use(chaiHttp);

const timeout = Number.parseInt(2000);

let productID = undefined;
let createdProduct=undefined;

const product = {
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


//*********
//AfterAll
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

// describe("Create test product", () => {
//     it("Should create product", done => {
//         chai
//             .request(app)
//             .get("/api/products")
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.text).contains("nodes")
//                 done();
//             });
//     });
// });

// describe("Get all products", () => {
//     it("Should get all products", done => {
//         chai
//             .request(app)
//             .get("/api/products")
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.text).contains("nodes")
//                 done();
//             });
//     });
// });

// describe("Get product by ID", () => {
//     it("Should get product when ID valid", done => {
//         chai
//             .request(app)
//             .get("/api/products/1")
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.text).contains("name")
//                 done();
//             });
//     });

//     it("Should return 404 when product's ID nonexistent", done => {
//         chai
//             .request(app)
//             .get("/api/products/6666")
//             .end((err, res) => {
//                 expect(res).to.have.status(404);
//                 done();
//             });
//     });
// });

// describe("Create product", () => {
//     it("Should create product when valid request", done => {
//         chai
//             .request(app)
//             .post("/api/products")
//             .send({ "name": "testProduct" })
//             .end((err, res) => {
//                 expect(res).to.have.status(201);
//                 done();
//             });
//     });
// });

// describe("Update product by ID", () => {
//     var id = null;
//     const productName = "testProduct"
//     before(function (done) {
//         chai
//             .request(app)
//             .post("/api/products")
//             .send({ "name": productName })
//             .end((err, res) => {
//                 expect(res).to.have.status(201);
//                 expect(res.body.name).equals(productName)
//                 id = res.body.id.low
//                 done()
//             });
//     })

//     it("Should update product when ID valid", done => {
//         const updatedProductName = "testProductV2"
//         chai
//             .request(app)
//             .put("/api/products/" + id)
//             .send({ "name": updatedProductName })
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body.id.low).equals(id)
//                 expect(res.body.name).equals(updatedProductName)
//                 done();
//             });
//     });

//     it("Should return 404 when product ID not found", done => {
//         const invalidId = 9999
//         const updatedProductName = "testProductV2"
//         chai
//             .request(app)
//             .put("/api/products/" + invalidId)
//             .send({ "name": updatedProductName })
//             .end((err, res) => {
//                 expect(res).to.have.status(404);
//                 done();
//             });
//     });
// });

// describe("Delete product by ID", () => {
//     var id = null;
//     const productName = "testProduct"
//     before(function (done) {
//         chai
//             .request(app)
//             .post("/api/products")
//             .send({ "name": productName })
//             .end((err, res) => {
//                 expect(res).to.have.status(201);
//                 expect(res.body.name).equals(productName)
//                 id = res.body.id.low
//                 done()
//             });
//     })

//     it("Should delete product when ID valid", done => {
//         chai
//             .request(app)
//             .delete("/api/products/" + id)
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(Number.parseInt(res.body.id)).equals(id)
//                 expect(res.body.message).equals("Product has been deleted.")
//                 done();
//             });
//     });

//     it("Should return 404 when product ID not found", done => {
//         const invalidId = 9999
//         chai
//             .request(app)
//             .delete("/api/products/" + invalidId)
//             .end((err, res) => {
//                 expect(res).to.have.status(404);
//                 done();
//             });
//     });
// });