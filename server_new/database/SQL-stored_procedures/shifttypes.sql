CREATE PROCEDURE getShiftTypeWithNaam
@naam varchar(100)
AS
Select *
From shifttypes
Where naam=@naam;
--------------------------------------------------
CREATE PROCEDURE getAllShifttypes
AS
Select *
From shifttypes;
--------------------------------------------------
CREATE PROCEDURE removeShifttypeWithNaam
@naam varchar(100)
AS
DELETE 
FROM shifttypes 
WHERE naam=@naam;
Select*
from shifttypes;
--------------------------------------------------
CREATE PROCEDURE addShifttype
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
SELECT * 
FROM shifttypes;
--------------------------------------------------
CREATE PROCEDURE updateShifttype
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
SELECT * 
FROM shifttypes;


