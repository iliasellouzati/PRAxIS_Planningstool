Create TABLE werknemer_contract
(
Id int not null primary key IDENTITY(1,1),
werknemers_id numeric(28, 0) not null,
begindatum nvarchar(10) not null,
einddatum nvarchar(10) not null,
CONSTRAINT FK_werknemers_contract_werknemers FOREIGN KEY (werknemers_id) REFERENCES werknemers (id) 
)
---------------------------------------------
CREATE PROCEDURE getWerknemerContractsFromEmployee
@werknemer_id int
as
SELECT * 
FROM werknemer_contract
where  werknemer_id = @werknemer_id 
order by begindatum asc;;
---------------------------------------------
CREATE PROCEDURE updateIndividualContractForEmployee
@id int,
@begindatum nvarchar(10),
@einddatum nvarchar(10)
as
UPDATE werknemer_contract
SET begindatum=@begindatum, einddatum=@einddatum 
where Id=@id
---------------------------------------------
CREATE PROCEDURE addIndividualContractForEmployee
@werknemer_id int,
@begindatum nvarchar(10),
@einddatum nvarchar(10)
as
INSERT INTO werknemer_contract
VALUES (@werknemer_id,@begindatum,@einddatum) 
---------------------------------------------
CREATE PROCEDURE getAllContractsForAllEmployee
AS
SELECT *
FROM werknemer_contract;