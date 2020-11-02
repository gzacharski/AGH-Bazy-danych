create (SampleSupplier:Supplier{SupplierID: 00000, CompanyName:'SampleCompany', ContactName:'SampleContactName',
ContactTitle:'SampleContactTitle', Address:'SampleAddress', City:'SampleCity', Region:'SampleRegion',
PostalCode:'SamplePostalCode', Country:'SampleCountry', Phone:'SamplePhone', Fax:'SampleFax',
HomePage:'SampleHomePage'}),

(SampleProduct:Product{ProductID:00000, ProductName:'SampleProductName', QuantityPerUnit:0,
UnitPrice:0, UnitsInStock:0, UnitsOnOrder:0, RecordedLevel: 0, Discontinued: true}),

(SampleCategory:Category{CategoryID:0000, CategoryName:'SampleCategoryName', Description:'SampleDescription', Picture:'SamplePicture'}),


(SampleOrder:Order{OrderID:0000000, Order:2030-01-10, RequiredDate:2030-01-20, ShippedDate:2020-01-01,
ShipAddress:'SampleShipAddress', ShipCity:'SampleShipCity', ShipRegion:'SampleShipRegion', ShipPostalCode:'SamplePostalCode',
ShipCountry:'SampleShipCountry', UnitPrice:0.00, Quantity:0, Discount:0}),

(SampleShipper:Shipper{ShipperID:0000, CompanyName:'SampleCompanyName', Phone:'000000000'}),

(SampleEmployee:Employee{EmployeeID:0000, LastName:'SampleLastName', FirstName:'SampleFirstName', Title:'SampleTitle',
TitleOfCourtesy:'SampleTitleOfCourtesy',BirthDate:1970-01-01, HireDate:2020-01-01, Address:'SampleAddress', City:'City',
Region:'SampleRegion', PostalCode:'00-000', Country:'SampleCountry', HomePhone:'000-000-000', Extension:'SampleExtension',
Photo:'SamplePhoto', Notes:'SampleNotes', ReportsTo:'SampleReportsTo', PhotoPath:'SamplePhotoPath'}),

(SampleTerritory:Territory{TerritoryID:0000,TerritoryDescription:'SampleTerritoryDescription'}),

(SampleRegion:Region{RegionID:0000, RegionDescription:'SampleRegionDescription'}),

(SampleCustomer:Customer{CustomerID:000000, CompanyName:'SampleCompanyName', ContactName:'SampleContactName',
ContactTitle:'SampleContactTitle', Address:'SampleAddress', City:'SampleCity', Region:'SampleRegion', PostalCode:'SamplePostalCode',
Country:'SampleCountry', Phone:'SamplePhone', Fax:'SampleFax'}),

(SampleCustomerDemographics:CustomerDemographics{CustomerTypeID:0000, CustomerDescription:'SampleCustomerDescription'}),

(SampleProduct)-[:BELONGS_TO]->(SampleCategory),
(SampleSupplier)-[:SUPPLIES]->(SampleProduct),
(SampleOrder)-[:INCLUDES]->(SampleProduct),
(SampleShipper)-[:TRANSPORTS]->(SampleOrder),
(SampleEmployee)-[:COORDINATES]->(SampleOrder),
(SampleEmployee)-[:IS_ASSIGNED_TO]->(SampleTerritory),
(SampleTerritory)-[:BASED_IN]->(SampleRegion),
(SampleCustomer)-[:ORDERS]->(SampleOrder),
(SampleCustomer)-[:IS_DEMOGRAPHIC_TYPE]->(SampleCustomerDemographics)