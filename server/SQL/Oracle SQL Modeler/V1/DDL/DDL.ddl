-- Generated by Oracle SQL Developer Data Modeler 19.2.0.182.1216
--   at:        2021-09-21 01:07:03 CEST
--   site:      SQL Server 2012
--   type:      SQL Server 2012



CREATE TABLE shift (
    id                NUMERIC(28) NOT NULL,
    datum             VARCHAR(100) NOT NULL,
    shifttypes_naam   VARCHAR(100) NOT NULL,
    werknemers_id     NUMERIC(28) NOT NULL
)


ALTER TABLE SHIFT ADD constraint shift_pk PRIMARY KEY CLUSTERED (ID)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON ) 

CREATE TABLE shifttypes (
    naam             VARCHAR(100) NOT NULL,
    beginuur         VARCHAR(25),
    einduur          VARCHAR(25),
    variabele_uren   VARCHAR(25),
    vaste_uren       VARCHAR(25),
    kleurcode        VARCHAR(25) NOT NULL
)



ALTER TABLE SHIFTTYPES ADD constraint shifttypes_pk PRIMARY KEY CLUSTERED (NAAM)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON ) 


CREATE TABLE werknemers (
    id      NUMERIC(28) NOT NULL,
    naam    VARCHAR(100) NOT NULL,
    email   VARCHAR(100) NOT NULL
)



ALTER TABLE WERKNEMERS ADD constraint werknemers_pk PRIMARY KEY CLUSTERED (ID)
     WITH (
     ALLOW_PAGE_LOCKS = ON , 
     ALLOW_ROW_LOCKS = ON ) 

ALTER TABLE SHIFT
    ADD CONSTRAINT shift_shifttypes_fk FOREIGN KEY ( shifttypes_naam )
        REFERENCES shifttypes ( naam )
ON DELETE NO ACTION 
    ON UPDATE no action 

ALTER TABLE SHIFT
    ADD CONSTRAINT shift_werknemers_fk FOREIGN KEY ( werknemers_id )
        REFERENCES werknemers ( id )
ON DELETE NO ACTION 
    ON UPDATE no action 



-- Oracle SQL Developer Data Modeler Summary Report: 
-- 
-- CREATE TABLE                             3
-- CREATE INDEX                             0
-- ALTER TABLE                              5
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE DATABASE                          0
-- CREATE DEFAULT                           0
-- CREATE INDEX ON VIEW                     0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE ROLE                              0
-- CREATE RULE                              0
-- CREATE SCHEMA                            0
-- CREATE SEQUENCE                          0
-- CREATE PARTITION FUNCTION                0
-- CREATE PARTITION SCHEME                  0
-- 
-- DROP DATABASE                            0
-- 
-- ERRORS                                   0
-- WARNINGS                                 0
