//*************************************
//constraints for northwind database
//*************************************
//CREATE CONSTRAINT ON (o:Order) ASSERT o.id IS UNIQUE;

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