CREATE PROCEDURE getAllStatusOfCalendarsByYear
@year varchar(4)
AS
Select *
From status_calendar
Where month like '%'+@year
Order by MONTH;
-----------------------------------------------------
CREATE PROCEDURE addCalendarStatusForMonth
@month nvarchar(10),
 @progress int ,
 @version int,
 @time_saved varchar(50)
as
INSERT INTO status_calendar
VALUES (@month,@progress,@version,null,null,null,null,null,null,@time_saved);
-----------------------------------------------------
CREATE PROCEDURE getIndividualCalendarStatus
@month nvarchar(10),
@version int 
AS
Select progress
From status_calendar
where month= @month and version=@version;
-----------------------------------------------------
CREATE PROCEDURE updateProgressForIndividualCalendarStatus
@month nvarchar(10),
@version int 
as
UPDATE status_calendar
SET progress = 1
where month= @month and version=@version;
-----------------------------------------------------
CREATE PROCEDURE getLatestCalendarStatusForIndividualMonth
@month nvarchar(10)
AS
Select *
From status_calendar
where version= (SELECT MAX(version) from status_calendar where month=@month) 
and month=@month
-----------------------------------------------------
CREATE PROCEDURE finalizeIndividualCalendarStatus
@month nvarchar(10),
 @progress int ,
 @version int,
 @comment varchar(1500),
 @affected_employees int,
 @added_shifts int,
 @same_shifts int,
 @deleted_shifts int,
 @changed_shifts int,
 @time_saved varchar(50)
  AS
UPDATE status_calendar
SET progress=@progress,comment=@comment,affected_employees=@affected_employees,added_shifts=@added_shifts,same_shifts=@same_shifts,deleted_shifts=@deleted_shifts,changed_shifts=@changed_shifts,time_saved=@time_saved 
where month= @month and version=@version;