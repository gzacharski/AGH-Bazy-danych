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
    