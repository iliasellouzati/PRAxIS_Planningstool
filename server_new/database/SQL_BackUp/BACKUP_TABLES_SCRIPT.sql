USE [master]
GO
/****** Object:  Database [planning]    Script Date: 24/03/2022 15:08:30 ******/
CREATE DATABASE [planning]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'planning', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\planning.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'planning_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\planning_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [planning] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [planning].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [planning] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [planning] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [planning] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [planning] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [planning] SET ARITHABORT OFF 
GO
ALTER DATABASE [planning] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [planning] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [planning] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [planning] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [planning] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [planning] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [planning] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [planning] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [planning] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [planning] SET  DISABLE_BROKER 
GO
ALTER DATABASE [planning] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [planning] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [planning] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [planning] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [planning] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [planning] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [planning] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [planning] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [planning] SET  MULTI_USER 
GO
ALTER DATABASE [planning] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [planning] SET DB_CHAINING OFF 
GO
ALTER DATABASE [planning] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [planning] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [planning] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [planning] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [planning] SET QUERY_STORE = OFF
GO
USE [planning]
GO
/****** Object:  User [NodeJS_Server]    Script Date: 24/03/2022 15:08:31 ******/
CREATE USER [NodeJS_Server] FOR LOGIN [NodeJS_Server] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [NodeJS_Server]
GO
ALTER ROLE [db_accessadmin] ADD MEMBER [NodeJS_Server]
GO
ALTER ROLE [db_datareader] ADD MEMBER [NodeJS_Server]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [NodeJS_Server]
GO
/****** Object:  UserDefinedTableType [dbo].[UDT_shift]    Script Date: 24/03/2022 15:08:31 ******/
CREATE TYPE [dbo].[UDT_shift] AS TABLE(
	[id] [int] NOT NULL,
	[datum] [date] NULL,
	[shifttypes_naam] [varchar](100) NULL,
	[werknemers_id] [int] NULL
)
GO
/****** Object:  Table [dbo].[contracttypes]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[contracttypes](
	[naam] [nchar](50) NOT NULL,
	[wekelijkse_contract_uren] [numeric](18, 2) NOT NULL,
	[maandelijke_contract_uren] [numeric](18, 2) NOT NULL,
	[max_opeenvolgende_shifts] [numeric](18, 0) NOT NULL,
	[max_shifts_per_week] [numeric](18, 0) NOT NULL,
	[nachtshiften_toegelaten] [bit] NOT NULL,
	[standby_toegelaten] [bit] NOT NULL,
	[max_uur_per_week] [numeric](18, 0) NULL,
	[max_uur_per_maand] [numeric](18, 0) NULL,
	[max_weekends_per_jaar] [numeric](18, 0) NULL,
	[ideaal_shifts_per_week] [numeric](18, 0) NULL,
 CONSTRAINT [PK_contracttypes] PRIMARY KEY CLUSTERED 
(
	[naam] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[shift]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[shift](
	[id] [numeric](28, 0) NOT NULL,
	[datum] [date] NOT NULL,
	[shifttypes_naam] [varchar](100) NOT NULL,
	[werknemers_id] [numeric](28, 0) NOT NULL,
	[beginuur] [varchar](10) NULL,
	[einduur] [varchar](10) NULL,
 CONSTRAINT [shift_pk] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[shifttypes]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[shifttypes](
	[naam] [varchar](100) NOT NULL,
	[beginuur] [varchar](25) NULL,
	[einduur] [varchar](25) NULL,
	[kleurcode] [varchar](25) NOT NULL,
	[verplicht] [bit] NULL,
	[thuiswerk] [bit] NULL,
	[aanpasbare_uren] [bit] NULL,
	[categorie] [nchar](100) NULL,
	[tekstkleurcode] [varchar](25) NULL,
	[border] [bit] NULL,
	[standaardtekst] [varchar](3) NULL,
	[standby] [bit] NULL,
	[actief] [bit] NULL,
 CONSTRAINT [shifttypes_pk] PRIMARY KEY CLUSTERED 
(
	[naam] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[status_calendar]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[status_calendar](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[month] [nvarchar](10) NOT NULL,
	[progress] [int] NOT NULL,
	[version] [int] NOT NULL,
	[comment] [varchar](1500) NULL,
	[affected_employees] [int] NULL,
	[added_shifts] [int] NULL,
	[same_shifts] [int] NULL,
	[deleted_shifts] [int] NULL,
	[changed_shifts] [int] NULL,
	[time_saved] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[status_planning]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[status_planning](
	[datum] [nchar](10) NOT NULL,
	[status] [int] NOT NULL,
 CONSTRAINT [PK_status_planning] PRIMARY KEY CLUSTERED 
(
	[datum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[week_structuren]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[week_structuren](
	[id] [numeric](18, 0) NOT NULL,
	[maandag] [varchar](50) NULL,
	[dinsdag] [varchar](50) NULL,
	[woensdag] [varchar](50) NULL,
	[donderdag] [varchar](50) NULL,
	[vrijdag] [varchar](50) NULL,
	[zaterdag] [varchar](50) NULL,
	[zondag] [varchar](50) NULL,
	[score] [numeric](18, 0) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[werknemers]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[werknemers](
	[id] [numeric](28, 0) NOT NULL,
	[naam] [varchar](100) NOT NULL,
	[email] [varchar](100) NOT NULL,
	[contracttype] [varchar](50) NULL,
 CONSTRAINT [werknemers_pk] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[shift]  WITH CHECK ADD  CONSTRAINT [shift_shifttypes_fk] FOREIGN KEY([shifttypes_naam])
REFERENCES [dbo].[shifttypes] ([naam])
GO
ALTER TABLE [dbo].[shift] CHECK CONSTRAINT [shift_shifttypes_fk]
GO
ALTER TABLE [dbo].[shift]  WITH CHECK ADD  CONSTRAINT [shift_werknemers_fk] FOREIGN KEY([werknemers_id])
REFERENCES [dbo].[werknemers] ([id])
GO
ALTER TABLE [dbo].[shift] CHECK CONSTRAINT [shift_werknemers_fk]
GO
/****** Object:  StoredProcedure [dbo].[addCalendarStatusForMonth]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[addCalendarStatusForMonth]
@month nvarchar(10),
 @progress int ,
 @version int,
 @time_saved varchar(50)
as
INSERT INTO status_calendar
VALUES (@month,@progress,@version,null,null,null,null,null,null,@time_saved);

GO
/****** Object:  StoredProcedure [dbo].[addContracttype]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[addContracttype]
@naam varchar(50),
@wekelijkse_contract_uren int,
@maandelijke_contract_uren int,
@max_opeenvolgende_shifts int,
@max_shifts_per_week int,
@nachtshiften_toegelaten bit,
@standby_toegelaten bit,
@max_uur_per_week int,
@max_uur_per_maand int,
@max_weekends_per_jaar int,
@ideaal_shifts_per_week int


as
INSERT INTO contracttypes
VALUES (@naam, @wekelijkse_contract_uren, @maandelijke_contract_uren, @max_opeenvolgende_shifts, @max_shifts_per_week, @nachtshiften_toegelaten,@standby_toegelaten,@max_uur_per_week, @max_uur_per_maand, @max_weekends_per_jaar, @ideaal_shifts_per_week);

GO
/****** Object:  StoredProcedure [dbo].[addShifttype]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[addShifttype]
@naam varchar(100),
@beginuur varchar(25),
@einduur varchar(25),
@kleurcode varchar(25),
@verplicht bit,
@thuiswerk bit,
@aanpasbare_uren bit,
@categorie varchar(100),
@tekstkleurcode varchar(25),
@border bit,
@standaardtekst varchar(3),
@standby bit,
@actief bit
as
INSERT INTO shifttypes
VALUES (@naam,@beginuur,@einduur,@kleurcode,@verplicht,@thuiswerk,@aanpasbare_uren,@categorie,@tekstkleurcode,@border,@standaardtekst,@standby,@actief);
GO
/****** Object:  StoredProcedure [dbo].[addWeekStructuur]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[addWeekStructuur]
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
GO
/****** Object:  StoredProcedure [dbo].[addWerknemer]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[addWerknemer]
@id int,
@naam varchar(100),
@email varchar(100),
@contracttype varchar(50)
as
INSERT INTO werknemers
VALUES (@id, @naam,@email,@contracttype);
SELECT * 
FROM werknemers;
GO
/****** Object:  StoredProcedure [dbo].[deleteOneShifts]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[deleteOneShifts]
@datum date,

@werknemers_id int

AS
BEGIN
	DELETE FROM shift 
	WHERE datum=@datum AND werknemers_id=@werknemers_id
END
GO
/****** Object:  StoredProcedure [dbo].[getAllContacttypes]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getAllContacttypes]
AS
Select *
From contracttypes;
GO
/****** Object:  StoredProcedure [dbo].[getAllShifts]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--------------------------------------------------
CREATE PROCEDURE [dbo].[getAllShifts]
AS
Select *
From shift;
GO
/****** Object:  StoredProcedure [dbo].[getAllShifttypes]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getAllShifttypes]
AS
Select *
From shifttypes;
GO
/****** Object:  StoredProcedure [dbo].[getAllStatusOfCalendarsByYear]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getAllStatusOfCalendarsByYear]
@year varchar(4)
AS
Select *
From status_calendar
Where month like '%'+@year
Order by MONTH;


GO
/****** Object:  StoredProcedure [dbo].[getAllWeekStructuren]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getAllWeekStructuren]
AS
Select *
From week_structuren;
GO
/****** Object:  StoredProcedure [dbo].[getAllWerknemers]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getAllWerknemers]

AS
Select *
From werknemers;

GO
/****** Object:  StoredProcedure [dbo].[getCalendarShifts]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getCalendarShifts]
@begindatum date,
@einddatum date
as
SELECT * 
FROM shift
where  datum >= @begindatum and datum <= @einddatum ;
GO
/****** Object:  StoredProcedure [dbo].[getCalendarShiftsFromEmployee]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getCalendarShiftsFromEmployee]
@begindatum date,
@einddatum date,
@werknemers_id int
as
SELECT * 
FROM shift
where  datum >= @begindatum and datum <= @einddatum 
and werknemers_id = @werknemers_id
order by datum asc;
GO
/****** Object:  StoredProcedure [dbo].[getContracttypeWithNaam]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getContracttypeWithNaam]
@naam varchar(50)
AS
Select *
From contracttypes
Where naam=@naam;
GO
/****** Object:  StoredProcedure [dbo].[getNewShiftId]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getNewShiftId]
AS
Select *
From shift
where id= ( SELECT MAX(id) FROM shift);
GO
/****** Object:  StoredProcedure [dbo].[getShiftTypeWithNaam]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getShiftTypeWithNaam]
@naam varchar(100)
AS
Select *
From shifttypes
Where naam=@naam;
GO
/****** Object:  StoredProcedure [dbo].[getWeekStructuurWithId]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getWeekStructuurWithId]
@id int
AS
Select *
From week_structuren
Where id=@id;
GO
/****** Object:  StoredProcedure [dbo].[getWerknemerWithId]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getWerknemerWithId]
@id int
AS
Select *
From werknemers
Where id=@id;

GO
/****** Object:  StoredProcedure [dbo].[getYearlyCalendarOverview]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[getYearlyCalendarOverview]
@datum varchar(10)
as
SELECT * 
FROM status_planning
where datum LIKE '%'+@datum+'%';
GO
/****** Object:  StoredProcedure [dbo].[removeContracttypeWithNaam]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[removeContracttypeWithNaam]
@naam varchar(50)
AS
DELETE 
FROM contracttypes 
WHERE naam=@naam;
GO
/****** Object:  StoredProcedure [dbo].[removeShifttypeWithNaam]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[removeShifttypeWithNaam]
@naam varchar(100)
AS
DELETE 
FROM shifttypes 
WHERE naam=@naam;
GO
/****** Object:  StoredProcedure [dbo].[removeWeekStructuurWithId]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[removeWeekStructuurWithId]
@id int
AS
DELETE 
FROM week_structuren 
WHERE id=@id;
GO
/****** Object:  StoredProcedure [dbo].[removeWerknemerWithId]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[removeWerknemerWithId]
@id int
AS
DELETE 
FROM werknemers 
WHERE id=@id;
GO
/****** Object:  StoredProcedure [dbo].[saveDeletedShifts]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Procedure [dbo].[saveDeletedShifts](
@shifts UDT_shift READONLY
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
                exec deleteOneShifts @datum=@datum,  @werknemers_id=@werknemers_id

                FETCH NEXT FROM cursor_A INTO @id,@datum, @shifttypes_naam, @werknemers_id;
            END;
    
            CLOSE cursor_A;
            DEALLOCATE cursor_A;
    End;
End
GO
/****** Object:  StoredProcedure [dbo].[saveNewShifts]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[saveNewShifts]
( 
	@shifts UDT_shift READONLY
)
AS
BEGIN
	INSERT INTO shift(id,datum,shifttypes_naam,werknemers_id)
	SELECT * from @shifts
END
GO
/****** Object:  StoredProcedure [dbo].[saveUpdatedShifts]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[saveUpdatedShifts]

(@shifts UDT_shift READONLY)

AS
BEGIN
	UPDATE SHIFT SET 
	SHIFT.shifttypes_naam = newShift.shifttypes_naam
	FROM @shifts newShift
	WHERE SHIFT.werknemers_id= newShift.werknemers_id AND SHIFT.datum = newShift.datum
END
GO
/****** Object:  StoredProcedure [dbo].[updateContracttype]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[updateContracttype]
@oudenaam varchar(50),
@naam varchar(50),
@wekelijkse_contract_uren int,
@maandelijke_contract_uren int,
@max_opeenvolgende_shifts int,
@max_shifts_per_week int,
@nachtshiften_toegelaten bit,
@standby_toegelaten bit,
@max_uur_per_week int,
@max_uur_per_maand int,
@max_weekends_per_jaar int,
@ideaal_shifts_per_week int
as
UPDATE contracttypes
SET naam = @naam, wekelijkse_contract_uren=@wekelijkse_contract_uren,maandelijke_contract_uren=@maandelijke_contract_uren,max_opeenvolgende_shifts=@max_opeenvolgende_shifts,max_shifts_per_week=@max_shifts_per_week, nachtshiften_toegelaten=@nachtshiften_toegelaten, standby_toegelaten=@standby_toegelaten, max_uur_per_week=@max_uur_per_week, max_uur_per_maand=@max_uur_per_maand, max_weekends_per_jaar=@max_weekends_per_jaar, ideaal_shifts_per_week=@ideaal_shifts_per_week
where naam= @oudenaam;
GO
/****** Object:  StoredProcedure [dbo].[updateShifttype]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[updateShifttype]
@oudenaam varchar(100),
@naam varchar(100),
@beginuur varchar(25),
@einduur varchar(25),
@kleurcode varchar(25),
@verplicht bit,
@thuiswerk bit,
@aanpasbare_uren bit,
@categorie varchar(100),
@tekstkleurcode varchar(25),
@border bit,
@standaardtekst varchar(3),
@standby bit,
@actief bit
as
UPDATE shifttypes
SET naam = @naam, beginuur=@beginuur,einduur=@einduur,kleurcode=@kleurcode,verplicht=@verplicht, thuiswerk=@thuiswerk, aanpasbare_uren=@aanpasbare_uren, categorie=@categorie, tekstkleurcode=@tekstkleurcode, border=@border, standaardtekst=@standaardtekst, standby =@standby, actief=@actief
where naam= @oudenaam;

GO
/****** Object:  StoredProcedure [dbo].[updateWeekStructuur]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[updateWeekStructuur]
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
GO
/****** Object:  StoredProcedure [dbo].[updateWerknemer]    Script Date: 24/03/2022 15:08:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[updateWerknemer]
@id int,
@naam varchar(100),
@email varchar(100),
@contracttype varchar(50)
as
UPDATE werknemers
SET naam=@naam, email=@email, contracttype=@contracttype
where id= @id;
GO
USE [master]
GO
ALTER DATABASE [planning] SET  READ_WRITE 
GO
