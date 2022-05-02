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
@maandag varchar(100),
@dinsdag varchar(100),
@woensdag varchar(100),
@donderdag varchar(100),
@vrijdag varchar(100),
@zaterdag varchar(100),
@zondag varchar(100),
@score int,
@nacht_week bit ,
@omschakeling_dag_naar_nacht bit ,
@omschakeling_nacht_naar_dag bit 
as
INSERT INTO week_structuren
VALUES (@maandag,@dinsdag,@woensdag, @donderdag,@vrijdag,@zaterdag,@zondag,@score,@nacht_week,@omschakeling_dag_naar_nacht,@omschakeling_nacht_naar_dag );

--------------------------------------------------
CREATE PROCEDURE updateWeekStructuur
@id int,
@maandag varchar(100),
@dinsdag varchar(100),
@woensdag varchar(100),
@donderdag varchar(100),
@vrijdag varchar(100),
@zaterdag varchar(100),
@zondag varchar(100),
@score int,
@nacht_week bit ,
@omschakeling_dag_naar_nacht bit ,
@omschakeling_nacht_naar_dag bit 
as
UPDATE week_structuren
SET maandag=@maandag, dinsdag=@dinsdag, woensdag=@woensdag, donderdag=@donderdag, vrijdag=@vrijdag, zaterdag=@zaterdag, zondag=@zondag, score=@score, nacht_week=@nacht_week, omschakeling_dag_naar_nacht=@omschakeling_dag_naar_nacht,omschakeling_nacht_naar_dag=@omschakeling_nacht_naar_dag
where id= @id;
