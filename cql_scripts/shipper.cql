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