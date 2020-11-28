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
