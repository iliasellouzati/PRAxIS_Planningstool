class Employee {
    constructor(id, naam, email, shifts) {
        this.id = id;
        this.naam = naam;
        this.email = email;
        this.shifts = shifts;
    }
    static StandaardEmployee(id, naam, email) {
        return new Employee(id, naam, email, null)
    
    }
    static PlanningEmployee(id, naam, email, shifts) {
        return new Employee(id, naam, email, shifts)
    }

}

export default Employee;