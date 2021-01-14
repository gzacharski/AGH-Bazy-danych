const chai = require('chai')
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

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

describe("Get all Ordered By relationships", () => {
    it("Should get All Ordered By relationships", done => {
        chai
            .request(app)
            .get("/api/orders/customers/all")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get Ordered By Relationships by specific Order and Customer (existing relationship)", () => {
    //existing relationship for following parameters
    let validOrderId = 30049;
    let validCustomerId = 'ALFKI';
    it("Should get Ordered By relationships for valid request (existing relationship)", done => {
        chai
            .request(app)
            .get("/api/orders/"+validOrderId+"/customers/"+validCustomerId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).contains("nodes")
                done();
            });
    });
});

describe("Get Ordered By Relationships by specific Order and Customer (not existing relationship)", () => {
    //not existing relationship for following parameters
    let validOrderId = 31177;
    let validCustomerId = 'ALFKI';
    it("Should get Ordered By relationships between valid Order ID and Customer ID (not existing relationship)", done => {
        chai
            .request(app)
            .get("/api/orders/"+validOrderId+"/customers/"+validCustomerId)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });
});

describe("Create Ordered By relationship", () => {
    //Order has already got Customer
    let validOrderId = 31177;
    let validCustomerId = 'ALFKI';
    it("Should not create Contains relationship when invalid request (Order has already got Customer)", done => {
        chai
            .request(app)
            .post("/api/orders/"+validOrderId+"/customers"+validCustomerId)
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    }).timeout(5000);
});

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

    it("Should create Supplies relationship when valid request", done => {
        chai
            .request(app)
            .post("/api/suppliers/"+supplierId+"/products/"+productId)
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });

    it("Should delete Supplies relationship when valid request", done => {
        chai
            .request(app)
            .delete("/api/suppliers/"+supplierId+"/products/"+productId)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});


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

describe("Create Product Order", () => {
    const validCustomerId = 'ALFKI';
    const validProductId = 1;
    it("Should create Product Order when valid request", done => {
        chai
            .request(app)
            .post("/api/customers/"+validCustomerId+"/products/"+validProductId)
            .send({
                    "orderDate": "2020-01-01",
                    "requiredDate" : "2020-06-01",
                    "shippedDate" : "2020-01-05",
                    "freight" : 1,
                    "shipName" : "Grdgtr Gdx Ivgjov",
                    "shipAddress" : "Evydnh St. 56",
                    "shipCity" : "Waviyoyim",
                    "shipPostalCode" : "9154-92838",
                    "shipCountry" : "Sweden",
                    "unitPrice" : 20.00,
                    "quantity" : 1,
                    "discount" : 5.5
                })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    });
});

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

describe("Create new Product Order", () => {
    const validCustomerId = 'ALFKI';
    const validProductId = 1;
    it("Should create new Product Order when valid request", done => {
        chai
            .request(app)
            .post("/api/orders")
            .send({
                "customerId": validCustomerId,
                "productId": validProductId,
                "orderDate": "2020-01-01",
                "requiredDate" : "2020-06-01",
                "shippedDate" : "2020-01-05",
                "freight" : 1,
                "shipName" : "Grdgtr Gdx Ivgjov",
                "shipAddress" : "Evydnh St. 56",
                "shipCity" : "Waviyoyim",
                "shipPostalCode" : "9154-92838",
                "shipCountry" : "Sweden",
                "unitPrice" : 20.00,
                "quantity" : 1,
                "discount" : 5.5
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                done();
            });
    }).timeout(15000);
    it("Should not create new Product Order when invalid request (too much stocks in order", done => {
        chai
            .request(app)
            .post("/api/orders")
            .send({
                "customerId": validCustomerId,
                "productId": validProductId,
                "requiredDate" : "2020-06-01",
                "shippedDate" : "2020-01-05",
                "freight" : 1,
                "shipName" : "Grdgtr Gdx Ivgjov",
                "shipAddress" : "Evydnh St. 56",
                "shipCity" : "Waviyoyim",
                "shipPostalCode" : "9154-92838",
                "shipCountry" : "Sweden",
                "unitPrice" : 20.00,
                "quantity" : 10000000,
                "discount" : 5.5
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                done();
            });
    }).timeout(15000);
});
