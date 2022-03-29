CREATE PROCEDURE getWerknemerWithId
@id int
AS
Select *
From werknemers
Where id=@id;
--------------------------------------------------
CREATE PROCEDURE getAllWerknemers
AS
Select *
From werknemers;
--------------------------------------------------
CREATE PROCEDURE removeWerknemerWithId
@id int
AS
DELETE 
FROM werknemers 
WHERE id=@id;
Select*
from werknemers;
--------------------------------------------------
CREATE PROCEDURE addWerknemer
@id int,
@naam varchar(100),
@email varchar(100),
@contracttype varchar(50)
as
INSERT INTO werknemers
VALUES (@id, @naam,@email,@contracttype);
SELECT * 
FROM werknemers;
--------------------------------------------------
CREATE PROCEDURE updateWerknemer
@id int,
@naam varchar(100),
@email varchar(100),
@contracttype varchar(50)
as
UPDATE werknemers
SET naam=@naam, email=@email, contracttype=@contracttype
where id= @id;
SELECT * 
FROM werknemers;


Create TABLE werknemer
(
id int not null primary key IDENTITY(1,1),
voornaam nvarchar(100) not null,
familienaam nvarchar(100) not null,
contracttype_id int not null,
email nvarchar(100) null,
franstalig bit not null,
opleiding bit not null,
geboortedatum nvarchar(10),
geboortedatum_partner nvarchar(10),

CONSTRAINT FK_werknemer_contracttypes2 FOREIGN KEY (contracttype_id) REFERENCES contracttypes2 (id) 

)
