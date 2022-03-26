CREATE PROCEDURE getAllShifts
AS
Select *
From shift;

----------------------------------------------
CREATE PROCEDURE getCalendarShifts
@begindatum date,
@einddatum date
as
SELECT * 
FROM shift
where  datum >= @begindatum and datum <= @einddatum ;
-----------------------------------------------
CREATE PROCEDURE getNewShiftId
AS
Select *
From shift
where id= ( SELECT MAX(id) FROM shift);
-----------------------------------------------
CREATE TYPE UDT_shift AS TABLE
(
id int not null,
datum date,
shifttypes_naam varchar(100),
werknemers_id int)
--------------------------------------------------
CREATE TYPE UDT_shift2 AS TABLE
(
datum date,
shifttypes_naam varchar(100),
werknemers_id int,
beginuur nvarchar(5),
einduur nvarchar(5))
--------------------------------------------------
CREATE PROCEDURE saveNewShifts
( 
	@shifts UDT_shift READONLY
)
AS
BEGIN
	INSERT INTO shift(id,datum,shifttypes_naam,werknemers_id)
	SELECT * from @shifts
END
--------------------------------------------------
CREATE PROCEDURE saveUpdatedShifts
(
    @shifts UDT_shift READONLY
)
AS
BEGIN
	UPDATE SHIFT SET 
	SHIFT.shifttypes_naam = newShift.shifttypes_naam
	FROM @shifts newShift
	WHERE SHIFT.werknemers_id= newShift.werknemers_id AND SHIFT.datum = newShift.datum
END
-------------------------------------------------
CREATE PROCEDURE saveDeletedShifts
(
	@shifts UDT_shift READONLY
)

AS
BEGIN
	DELETE FROM shift 
	FROM @shifts newShift
	WHERE SHIFT.shifttypes_naam = newShift.shifttypes_naam
	AND SHIFT.werknemers_id = newShift.werknemers_id
END
--------------------------------------------------
CREATE PROCEDURE deleteOneShifts
@datum date,
@werknemers_id int

AS
BEGIN
	DELETE FROM shift 
	WHERE datum=@datum AND werknemers_id=@werknemers_id
END
---------------------------------------------------
CREATE Procedure saveDeletedShifts(
@shifts as UDT_shift READONLY
)
AS
BEGIN
    DECLARE @id int,
	@datum date,
	@shifttypes_naam varchar(100),
	@werknemers_id int
    
    Declare cursor_A cursor
    For Select * from @shifts
    
    Begin
        OPEN cursor_A
    
        FETCH NEXT FROM cursor_A INTO @id,@datum, @shifttypes_naam, @werknemers_id;
            WHILE @@FETCH_STATUS = 0
            BEGIN
                -- To DO Logic
                exec deleteOneShifts @datum, @werknemers_id

                FETCH NEXT FROM cursor_A INTO @id,@datum, @shifttypes_naam, @werknemers_id;
            END;
    
            CLOSE cursor_A;
            DEALLOCATE cursor_A;
    End;
End
--------------------------------------------------------
CREATE PROCEDURE getCalendarShiftsFromEmployee
@begindatum date,
@einddatum date,
@werknemers_id int
as
SELECT * 
FROM shift
where  datum >= @begindatum and datum <= @einddatum 
and werknemers_id = @werknemers_id 
order by datum asc;;