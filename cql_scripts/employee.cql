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
RETURN e1,e2