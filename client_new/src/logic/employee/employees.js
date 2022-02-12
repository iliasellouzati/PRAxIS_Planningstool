import axios from "axios";

const getEmployees = async ()=> {
   return  await axios.get('/api/werknemers');
   
}

export {getEmployees}