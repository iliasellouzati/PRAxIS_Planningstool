CREATE PROCEDURE getWeekStructuurWithId
@id int
AS
Select *
From week_structuren
Where id=@id;
--------------------------------------------------
CREATE PROCEDURE getAllWeekStructuren
AS
Select *
From week_structuren;
--------------------------------------------------
CREATE PROCEDURE removeWeekStructuurWithId
@id int
AS
DELETE 
FROM week_structuren 
WHERE id=@id;
Select*
from week_structuren;
--------------------------------------------------
CREATE PROCEDURE addWeekStructuur
@id int,
@maandag varchar(50),
@dinsdag varchar(50),
@woensdag varchar(50),
@donderdag varchar(50),
@vrijdag varchar(50),
@zaterdag varchar(50),
@zondag varchar(50),
@score int
as
INSERT INTO week_structuren
VALUES (@id, @maandag,@dinsdag,@woensdag, @donderdag,@vrijdag,@zaterdag,@zondag,@score );
SELECT * 
FROM week_structuren;
--------------------------------------------------
CREATE PROCEDURE updateWeekStructuur
@id int,
@maandag varchar(50),
@dinsdag varchar(50),
@woensdag varchar(50),
@donderdag varchar(50),
@vrijdag varchar(50),
@zaterdag varchar(50),
@zondag varchar(50),
@score int
as
UPDATE week_structuren
SET maandag=@maandag, dinsdag=@dinsdag, woensdag=@woensdag, donderdag=@donderdag, vrijdag=@vrijdag, zaterdag=@zaterdag, zondag=@zondag, score=@score
where id= @id;
SELECT * 
FROM week_structuren;