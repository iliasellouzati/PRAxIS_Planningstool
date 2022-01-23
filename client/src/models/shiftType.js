class ShiftType {
    constructor(naam, beginuur, einduur,variabeleUren,vasteUren){
        this.id=naam;
        this.beginuur=beginuur;
        this.einduur=einduur;
        this.variabeleUren=variabeleUren;
        this.vasteUren=vasteUren;
    }

    static StandaardShift(naam, beginuur,einduur){
        return new ShiftType(naam,beginuur,einduur,null,null)
    }

    static VariabeleUrenShift(naam,variabeleUren ){
        return new ShiftType(naam,null,null,variabeleUren,null)
    }
    static VasteUrenShift(naam,vasteUren){
        return new ShiftType(naam,null,null,null,vasteUren)
    }
}

export default ShiftType;