CREATE DATABASE northwind;
:use northwind;
//*************************************
//constraints for northwind database
//*************************************
CREATE CONSTRAINT ON (e:Employee) ASSERT e.id IS UNIQUE;

//*************************************
//loading data from xml file
//creating employee nodes
//*************************************
CALL apoc.load.xml('file:///northwind/employees.xml')
YIELD value
UNWIND value._children as employee
WITH 
    [item IN employee._children WHERE item._type='EmployeeID'][0] AS employeeID,
    [item IN employee._children WHERE item._type='LastName'][0] AS lastName,
    [item IN employee._children WHERE item._type='FirstName'][0] AS firstName,
    [item IN employee._children WHERE item._type='Title'][0] AS title,
    [item IN employee._children WHERE item._type='TitleOfCourtesy'][0] AS titleOfCourtesy,
    [item IN employee._children WHERE item._type='BirthDate'][0] AS birthDate,
    [item IN employee._children WHERE item._type='HireDate'][0] AS hireDate,
    [item IN employee._children WHERE item._type='Address'][0] AS address,
    [item IN employee._children WHERE item._type='City'][0] AS city,
    [item IN employee._children WHERE item._type='Region'][0] AS region,
    [item IN employee._children WHERE item._type='PostalCode'][0] AS postalCode,
    [item IN employee._children WHERE item._type='Country'][0] AS country,
    [item IN employee._children WHERE item._type='HomePhone'][0] AS homePhone,
    [item IN employee._children WHERE item._type='Extension'][0] AS extension,
    [item IN employee._children WHERE item._type='Notes'][0] AS notes,
    [item IN employee._children WHERE item._type='ReportsTo'][0] AS reportsTo

MERGE (e:Employee {id: toInteger(employeeID._text)})
    SET 
    e.lastName=lastName._text,
    e.firstName=firstName._text,
    e.title=title._text,
    e.titleOfCourtesy=titleOfCourtesy._text,
    e.birthDate=birthDate._text,
    e.hireDate=hireDate._text,
    e.address=address._text,
    e.city=city._text,
    e.region=region._text,
    e.postalCode=postalCode._text,
    e.country=country._text,
    e.homePhone=homePhone._text,
    e.extension=toInteger(extension._text),
    e.notes=notes._text

WITH employeeID, reportsTo
MATCH (e1:Employee),(e2:Employee)
WHERE e1.id=toInteger(employeeID._text) AND e2.id=toInteger(reportsTo._text)
MERGE (e1)-[:REPORTS_TO]->(e2)
RETURN e1,e2;

//*************************************
//constraints for northwind database
//*************************************
CREATE CONSTRAINT ON (c:Category) ASSERT c.id IS UNIQUE;

//*************************************
//loading data from xml file
//creating category nodes
//*************************************
CALL apoc.load.xml("file:///northwind/categories.xml")
YIELD value
UNWIND value._children AS category
WITH
    [item IN category._children WHERE item._type='CategoryID'][0] AS categoryId,
    [item IN category._children WHERE item._type='CategoryName'][0] AS categoryName,
    [item IN category._children WHERE item._type='Description'][0] AS description
MERGE (c:Category {name:categoryName._text})
SET 
    c.id=toInteger(categoryId._text), 
    c.description=description._text;

//*************************************
//constraints for northwind database
//*************************************
CREATE CONSTRAINT ON (c:Customer) ASSERT c.id IS UNIQUE;

//*************************************
//loading data from xml file
//creating customer nodes
//*************************************
CALL apoc.load.xml("file:///northwind/customers.xml")
YIELD value
UNWIND value._children AS customer
WITH
    [item IN customer._children WHERE item._type='CustomerID'][0] AS customerID,
    [item IN customer._children WHERE item._type='CompanyName'][0] AS companyName,
    [item IN customer._children WHERE item._type='ContactName'][0] AS contactName,
    [item IN customer._children WHERE item._type='ContactTitle'][0] AS contactTitle,
    [item IN customer._children WHERE item._type='Address'][0] AS address,
    [item IN customer._children WHERE item._type='City'][0] AS city,
    [item IN customer._children WHERE item._type='PostalCode'][0] AS postalCode,
    [item IN customer._children WHERE item._type='Country'][0] AS country,
    [item IN customer._children WHERE item._type='Phone'][0] AS phone,
    [item IN customer._children WHERE item._type='Fax'][0] AS fax

MERGE (c:Customer {name:contactName._text})
SET 
    c.id=customerID._text,
    c.company=companyName._text,
    c.title=contactTitle._text,
    c.address=address._text,
    c.city=city._text,
    c.postalCode=postalCode._text,
    c.country=country._text,
    c.phone=phone._text,
    c.fax=fax._text;

//*************************************
//constraints for northwind database
//*************************************
CREATE CONSTRAINT ON (s:Supplier) ASSERT s.id IS UNIQUE;

//*************************************
//loading data from xml file
//creating supplier nodes
//*************************************
CALL apoc.load.xml('file:///northwind/suppliers.xml')
YIELD value
UNWIND value._children AS supplier
WITH
    [item IN supplier._children WHERE item._type='SupplierID'][0] as supplierID,
    [item IN supplier._children WHERE item._type='CompanyName'][0] as companyName,
    [item IN supplier._children WHERE item._type='ContactName'][0] as contactName,
    [item IN supplier._children WHERE item._type='ContactTitle'][0] as contactTitle,
    [item IN supplier._children WHERE item._type='Address'][0] as address,
    [item IN supplier._children WHERE item._type='City'][0] as city,
    [item IN supplier._children WHERE item._type='PostalCode'][0] as postalCode,
    [item IN supplier._children WHERE item._type='Country'][0] as country,
    [item IN supplier._children WHERE item._type='Phone'][0] as phone

MERGE (s:Supplier {companyName: companyName._text})
SET 
    s.id=toInteger(supplierID._text),
    s.contactName=contactName._text,
    s.contactTitle=contactTitle._text,
    s.address=address._text,
    s.city=city._text,
    s.postalCode=postalCode._text,
    s.country=country._text,
    s.phone=phone._text;

//*************************************
//constraints for northwind database
//*************************************
CREATE CONSTRAINT ON (s:Shipper) ASSERT s.id IS UNIQUE;

//*************************************
//loading data from xml file
//creating shipper nodes
//*************************************
CALL apoc.load.xml('file:///northwind/shippers.xml')
YIELD value
UNWIND value._children AS shipper
WITH
    [item IN shipper._children WHERE item._type='ShipperID'][0] AS shipperID,
    [item IN shipper._children WHERE item._type='CompanyName'][0] AS companyName,
    [item IN shipper._children WHERE item._type='Phone'][0] AS phone

MERGE (s:Shipper {id: toInteger(shipperID._text)})
SET
    s.companyName=companyName._text,
    s.phone=phone._text;

//*************************************
//constraints for northwind database
//*************************************
CREATE CONSTRAINT ON (p:Product) ASSERT p.id IS UNIQUE;

//*************************************
//loading data from xml file
//creating product nodes
//*************************************
CALL apoc.load.xml('file:///northwind/products.xml')
YIELD value
UNWIND value._children AS product
WITH
    [item IN product._children WHERE item._type='ProductID'][0] AS productId,
    [item IN product._children WHERE item._type='ProductName'][0] AS productName,
    [item IN product._children WHERE item._type='SupplierID'][0] AS supplierID, //relation
    [item IN product._children WHERE item._type='CategoryID'][0] AS categoryID, //relation
    [item IN product._children WHERE item._type='QuantityPerUnit'][0] AS quantityPerUnit,
    [item IN product._children WHERE item._type='UnitPrice'][0] AS unitPrice,
    [item IN product._children WHERE item._type='UnitsInStock'][0] AS unitsInStock,
    [item IN product._children WHERE item._type='UnitsOnOrder'][0] AS unitsOnOrder,
    [item IN product._children WHERE item._type='ReorderLevel'][0] AS reorderLevel,
    [item IN product._children WHERE item._type='Discontinued'][0] AS discontinued

MERGE (p:Product {name: productName._text})
SET 
    p.id=toInteger(productId._text),
    p.quantityPerUnit=quantityPerUnit._text,
    p.unitPrice=toFloat(unitPrice._text),
    p.unitsInStock=toInteger(unitsInStock._text),
    p.unitsOnOrder=toInteger(unitsOnOrder._text),
    p.reorderLevel=toInteger(reorderLevel._text),
    p.discontinued=toInteger(discontinued._text)

WITH productId, supplierID, categoryID
MATCH (p:Product),(s:Supplier), (c:Category)
WHERE p.id=toInteger(productId._text) 
    AND s.id=toInteger(supplierID._text)
    AND c.id=toInteger(categoryID._text)
MERGE (s)-[:SUPPLIES]->(p)
MERGE (p)-[:BELONGS_TO]->(c);

//*************************************
//constraints for northwind database
//*************************************
CREATE CONSTRAINT ON (o:Order) ASSERT o.id IS UNIQUE;

//*************************************
//loading data from xml file
//creating order nodes
//*************************************
CALL apoc.load.xml('file:///northwind/orders.xml')
YIELD value
UNWIND value._children AS order
WITH
    [item IN order._children WHERE item._type='OrderID'][0] AS orderID,
    [item IN order._children WHERE item._type='CustomerID'][0] AS customerID, //relation
    [item IN order._children WHERE item._type='EmployeeID'][0] AS employeeID, //relation
    [item IN order._children WHERE item._type='OrderDate'][0] AS orderDate,
    [item IN order._children WHERE item._type='RequiredDate'][0] AS requiredDate,
    [item IN order._children WHERE item._type='ShippedDate'][0] AS shippedDate,
    [item IN order._children WHERE item._type='ShipVia'][0] AS shipVia, //relation
    [item IN order._children WHERE item._type='Freight'][0] AS freight,
    [item IN order._children WHERE item._type='ShipName'][0] AS shipName,
    [item IN order._children WHERE item._type='ShipAddress'][0] AS shipAddress,
    [item IN order._children WHERE item._type='ShipCity'][0] AS shipCity,
    [item IN order._children WHERE item._type='ShipPostalCode'][0] AS shipPostalCode,
    [item IN order._children WHERE item._type='ShipCountry'][0] AS shipCountry

MERGE (o:Order {id: toInteger(orderID._text)})
SET
    o.orderDate=orderDate._text,
    o.requiredDate=requiredDate._text,
    o.shippedDate=shippedDate._text,
    o.freight=toInteger(freight._text),
    o.shipName=shipName._text,
    o.shipAddress=shipAddress._text,
    o.shipCity=shipCity._text,
    o.shipPostalCode=shipPostalCode._text,
    o.shipCountry=shipCountry._text

WITH orderID, customerID, employeeID, shipVia 
MATCH (o:Order), (c:Customer), (e:Employee), (s:Shipper)
WHERE o.id=toInteger(orderID._text)
    AND c.id=customerID._text
    AND e.id=toInteger(employeeID._text)
    AND s.id=toInteger(shipVia._text)
MERGE (s)-[:DELIVERS]->(o)
MERGE (o)-[:ORDERED_BY]->(c)
MERGE (o)-[:SOLD_BY]->(e);

//*************************************
//loading data from xml file
//creating order nodes
//*************************************
CALL apoc.load.xml('file:///northwind/orders_rand_10000.xml')
YIELD value
UNWIND value._children AS order
WITH
    [item IN order._children WHERE item._type='OrderID'][0] AS orderID,
    [item IN order._children WHERE item._type='CustomerID'][0] AS customerID, //relation
    [item IN order._children WHERE item._type='EmployeeID'][0] AS employeeID, //relation
    [item IN order._children WHERE item._type='OrderDate'][0] AS orderDate,
    [item IN order._children WHERE item._type='RequiredDate'][0] AS requiredDate,
    [item IN order._children WHERE item._type='ShippedDate'][0] AS shippedDate,
    [item IN order._children WHERE item._type='ShipVia'][0] AS shipVia, //relation
    [item IN order._children WHERE item._type='Freight'][0] AS freight,
    [item IN order._children WHERE item._type='ShipName'][0] AS shipName,
    [item IN order._children WHERE item._type='ShipAddress'][0] AS shipAddress,
    [item IN order._children WHERE item._type='ShipCity'][0] AS shipCity,
    [item IN order._children WHERE item._type='ShipPostalCode'][0] AS shipPostalCode,
    [item IN order._children WHERE item._type='ShipCountry'][0] AS shipCountry

MERGE (o:Order {id: toInteger(orderID._text)})
SET
    o.orderDate=orderDate._text,
    o.requiredDate=requiredDate._text,
    o.shippedDate=shippedDate._text,
    o.freight=toInteger(freight._text),
    o.shipName=shipName._text,
    o.shipAddress=shipAddress._text,
    o.shipCity=shipCity._text,
    o.shipPostalCode=shipPostalCode._text,
    o.shipCountry=shipCountry._text

WITH orderID, customerID, employeeID, shipVia 
MATCH (o:Order), (c:Customer), (e:Employee), (s:Shipper)
WHERE o.id=toInteger(orderID._text)
    AND c.id=customerID._text
    AND e.id=toInteger(employeeID._text)
    AND s.id=toInteger(shipVia._text)
MERGE (s)-[:DELIVERS]->(o)
MERGE (o)-[:ORDERED_BY]->(c)
MERGE (o)-[:SOLD_BY]->(e);

//*************************************
//loading data from xml file
//creating order nodes
//*************************************
CALL apoc.load.xml('file:///northwind/orders_rand_20000.xml')
YIELD value
UNWIND value._children AS order
WITH
    [item IN order._children WHERE item._type='OrderID'][0] AS orderID,
    [item IN order._children WHERE item._type='CustomerID'][0] AS customerID, //relation
    [item IN order._children WHERE item._type='EmployeeID'][0] AS employeeID, //relation
    [item IN order._children WHERE item._type='OrderDate'][0] AS orderDate,
    [item IN order._children WHERE item._type='RequiredDate'][0] AS requiredDate,
    [item IN order._children WHERE item._type='ShippedDate'][0] AS shippedDate,
    [item IN order._children WHERE item._type='ShipVia'][0] AS shipVia, //relation
    [item IN order._children WHERE item._type='Freight'][0] AS freight,
    [item IN order._children WHERE item._type='ShipName'][0] AS shipName,
    [item IN order._children WHERE item._type='ShipAddress'][0] AS shipAddress,
    [item IN order._children WHERE item._type='ShipCity'][0] AS shipCity,
    [item IN order._children WHERE item._type='ShipPostalCode'][0] AS shipPostalCode,
    [item IN order._children WHERE item._type='ShipCountry'][0] AS shipCountry

MERGE (o:Order {id: toInteger(orderID._text)})
SET
    o.orderDate=orderDate._text,
    o.requiredDate=requiredDate._text,
    o.shippedDate=shippedDate._text,
    o.freight=toInteger(freight._text),
    o.shipName=shipName._text,
    o.shipAddress=shipAddress._text,
    o.shipCity=shipCity._text,
    o.shipPostalCode=shipPostalCode._text,
    o.shipCountry=shipCountry._text

WITH orderID, customerID, employeeID, shipVia 
MATCH (o:Order), (c:Customer), (e:Employee), (s:Shipper)
WHERE o.id=toInteger(orderID._text)
    AND c.id=customerID._text
    AND e.id=toInteger(employeeID._text)
    AND s.id=toInteger(shipVia._text)
MERGE (s)-[:DELIVERS]->(o)
MERGE (o)-[:ORDERED_BY]->(c)
MERGE (o)-[:SOLD_BY]->(e);


//*************************************
//constraints for northwind database
//*************************************
CREATE CONSTRAINT ExistsCONTAINSodID ON ()-[rel:CONTAINS]-() ASSERT exists(rel.odID);

//*************************************
//loading data from xml file
//creating product nodes
//*************************************
CALL apoc.load.xml('file:///northwind/orderdetails.xml')
YIELD value
UNWIND value._children AS orderDetail
WITH
    [item IN orderDetail._children WHERE item._type='odID'][0] AS odID, //unique
    [item IN orderDetail._children WHERE item._type='OrderID'][0] AS orderID, //relation
    [item IN orderDetail._children WHERE item._type='ProductID'][0] AS productID, //relation
    [item IN orderDetail._children WHERE item._type='UnitPrice'][0] AS unitPrice,
    [item IN orderDetail._children WHERE item._type='Quantity'][0] AS quantity,
    [item IN orderDetail._children WHERE item._type='Discount'][0] AS discount

MATCH (o:Order),(p:Product)
WHERE o.id=toInteger(orderID._text)
    AND p.id=toInteger(productID._text)
MERGE (o)-[c:CONTAINS]->(p)
SET c = {
        odID : toInteger(odID._text),
        unitPrice : toFloat(unitPrice._text),
        quantity : toInteger(quantity._text),
        discount : toFloat(discount._text)
};
    
//*************************************
//constraints for northwind database
//*************************************
//CREATE CONSTRAINT ExistsCONTAINSodID ON ()-[rel:CONTAINS]-() ASSERT exists(rel.odID);

//*************************************
//loading data from xml file
//creating product nodes
//*************************************
CALL apoc.load.xml('file:///northwind/orderdetails_rand_10000.xml')
YIELD value
UNWIND value._children AS orderDetail
WITH
    [item IN orderDetail._children WHERE item._type='odID'][0] AS odID, //unique
    [item IN orderDetail._children WHERE item._type='OrderID'][0] AS orderID, //relation
    [item IN orderDetail._children WHERE item._type='ProductID'][0] AS productID, //relation
    [item IN orderDetail._children WHERE item._type='UnitPrice'][0] AS unitPrice,
    [item IN orderDetail._children WHERE item._type='Quantity'][0] AS quantity,
    [item IN orderDetail._children WHERE item._type='Discount'][0] AS discount

MATCH (o:Order),(p:Product)
WHERE o.id=toInteger(orderID._text)
    AND p.id=toInteger(productID._text)
MERGE (o)-[c:CONTAINS]->(p)
SET c = {
        odID : toInteger(odID._text),
        unitPrice : toFloat(unitPrice._text),
        quantity : toInteger(quantity._text),
        discount : toFloat(discount._text)
};

//*************************************
//constraints for northwind database
//*************************************
//CREATE CONSTRAINT ExistsCONTAINSodID ON ()-[rel:CONTAINS]-() ASSERT exists(rel.odID);

//*************************************
//loading data from xml file
//creating product nodes
//*************************************
CALL apoc.load.xml('file:///northwind/orderdetails_rand_20000.xml')
YIELD value
UNWIND value._children AS orderDetail
WITH
    [item IN orderDetail._children WHERE item._type='odID'][0] AS odID, //unique
    [item IN orderDetail._children WHERE item._type='OrderID'][0] AS orderID, //relation
    [item IN orderDetail._children WHERE item._type='ProductID'][0] AS productID, //relation
    [item IN orderDetail._children WHERE item._type='UnitPrice'][0] AS unitPrice,
    [item IN orderDetail._children WHERE item._type='Quantity'][0] AS quantity,
    [item IN orderDetail._children WHERE item._type='Discount'][0] AS discount

MATCH (o:Order),(p:Product)
WHERE o.id=toInteger(orderID._text)
    AND p.id=toInteger(productID._text)
MERGE (o)-[c:CONTAINS]->(p)
SET c = {
        odID : toInteger(odID._text),
        unitPrice : toFloat(unitPrice._text),
        quantity : toInteger(quantity._text),
        discount : toFloat(discount._text)
};
     