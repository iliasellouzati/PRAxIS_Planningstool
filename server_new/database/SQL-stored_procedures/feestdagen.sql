Create TABLE feestdagen
(
id int not null primary key IDENTITY(1,1),
naam nvarchar(100) not null,
jaar int not null,
datum date not null
)
----------------------------------------------------------------
CREATE PROCEDURE getFeestdagenBetweenDates
@begindatum date,
@einddatum date
as
SELECT * 
FROM feestdagen
where  datum >= @begindatum and datum <= @einddatum 
order by datum asc;
----------------------------------------------------------------

CREATE PROCEDURE getFeestdagWithId
@id int
AS
Select *
From feestdagen
Where id=@id;
--------------------------------------------------
CREATE PROCEDURE getAllFeestdagenInYear
@jaar int
AS
Select *
From feestdagen
Where jaar = @jaar;
--------------------------------------------------
CREATE PROCEDURE removeFeestdagWithId
@id int
AS
DELETE 
FROM feestdagen 
WHERE id=@id;
--------------------------------------------------
CREATE PROCEDURE addFeestdag
@naam nvarchar(100),
@jaar int,
@datum date
as
INSERT INTO feestdagen
VALUES (@naam,@jaar,@datum);
--------------------------------------------------
CREATE PROCEDURE updateFeestdag
@id int,
@naam nvarchar(100),
@jaar int,
@datum date
as
UPDATE feestdagen
SET naam=@naam, jaar=@jaar, datum=@datum
where id= @id;
