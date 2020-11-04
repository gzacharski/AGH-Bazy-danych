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
    s.phone=phone._text