CREATE PROCEDURE getAllContacttypes
AS
Select *
From contracttypes;

--------------------------------------------------

CREATE PROCEDURE getContracttypeWithNaam
@naam varchar(50)
AS
Select *
From contracttypes
Where naam=@naam;

--------------------------------------------------

CREATE PROCEDURE removeContracttypeWithNaam
@naam varchar(50)
AS
DELETE 
FROM contracttypes 
WHERE naam=@naam;
Select*
from contracttypes;

--------------------------------------------------

CREATE PROCEDURE addContracttype
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
SELECT * 
FROM contracttypes;

--------------------------------------------------

CREATE PROCEDURE updateContracttype
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
SELECT * 
FROM contracttypes;