class ShiftType {


    constructor(naam, beginuur, einduur,variabeleUren,vasteUren, kleur){
        this.naam=naam;
        this.beginuur=beginuur;
        this.einduur=einduur;
        this.variabeleUren=variabeleUren;
        this.vasteUren=vasteUren;
        this.kleur=kleur;
    }

    static StandaardShift(naam, beginuur,einduur,kleur){
        return new ShiftType(naam,beginuur,einduur,false,false,kleur)
    }

    static VariabeleUrenShift(naam,variabeleUren,kleur ){
        return new ShiftType(naam,null,null,variabeleUren,false,kleur)
    }
    static VasteUrenShift(naam,vasteUren,kleur){
        return new ShiftType(naam,null,null,false,vasteUren,kleur)
    }
}

export default ShiftType;