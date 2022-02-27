
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

