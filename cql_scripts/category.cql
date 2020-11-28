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