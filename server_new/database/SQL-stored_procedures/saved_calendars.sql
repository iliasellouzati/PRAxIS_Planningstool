
Create TABLE saved_calendars
(
id int not null primary key IDENTITY(1,1),
calendar_versie nvarchar(10) not null,
werknemer_id int not null,
werknemer_voornaam nvarchar(100) not null,
werknemer_familienaam nvarchar(100) not null,
shift_datum nvarchar(10) not null,
shift_shifttypes_naam varchar(100) not null,
shift_beginuur nvarchar(5) null,
shift_einduur nvarchar(5) null,
shifttypes_beginuur varchar(25) NOT null ,
shifttypes_einduur varchar(25) NOT NULL,
shifttypes_kleurcode varchar(25) NOT NULL,
shifttypes_verplicht bit NOT NULL,
shifttypes_thuiswerk bit NOT NULL,
shifttypes_aanpasbare_uren bit NOT NULL,
shifttypes_categorie nchar(100) NOT NULL,
shifttypes_tekstkleurcode varchar(25) NOT NULL,
shifttypes_border bit NOT NULL,
shifttypes_standaardtekst varchar(3) NOT NULL,
shifttypes_standby bit NOT NULL,

)


CREATE TYPE UDT_saved_calendar AS TABLE
(
calendar_versie nvarchar(10) not null,
werknemer_id int not null,
werknemer_voornaam nvarchar(100) not null,
werknemer_familienaam nvarchar(100) not null,
shift_datum nvarchar(10) not null,
shift_shifttypes_naam varchar(100) not null,
shift_beginuur nvarchar(5) null,
shift_einduur nvarchar(5) null,
shifttypes_beginuur varchar(25) NOT null ,
shifttypes_einduur varchar(25) NOT NULL,
shifttypes_kleurcode varchar(25) NOT NULL,
shifttypes_verplicht bit NOT NULL,
shifttypes_thuiswerk bit NOT NULL,
shifttypes_aanpasbare_uren bit NOT NULL,
shifttypes_categorie nchar(100) NOT NULL,
shifttypes_tekstkleurcode varchar(25) NOT NULL,
shifttypes_border bit NOT NULL,
shifttypes_standaardtekst varchar(3) NOT NULL,
shifttypes_standby bit NOT NULL
)


CREATE PROCEDURE saveShiftsToSavedCalendar
@shifts UDT_saved_calendar READONLY
AS
BEGIN
	INSERT INTO saved_calendars(
	calendar_versie,
	werknemer_id,
	werknemer_voornaam,
	werknemer_familienaam,
	shift_datum,
	shifttypes_naam,
	shift_beginuur,
	shift_einduur,
	shifttypes_beginuur,
	shifttypes_einduur,
	shifttypes_kleurcode,
	shifttypes_verplicht,
	shifttypes_thuiswerk,
	shifttypes_aanpasbare_uren,
	shifttypes_categorie,
	shifttypes_tekstkleurcode,
	shifttypes_border,
	shifttypes_standaardtekst,
	shifttypes_standby
	)
	SELECT * from @shifts
END

CREATE PROCEDURE getSavedCalendarShifts
@calendar_versie nvarchar(10)
as
SELECT * 
FROM saved_calendars
where  calendar_versie = @calendar_versie ;