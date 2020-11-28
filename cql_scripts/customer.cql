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