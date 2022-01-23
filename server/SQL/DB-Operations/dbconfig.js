const config = {
    server: 'localhost', //192.168.0.244
    port:50396,
    user: "NodeJS_Server",
    password: "PRAxIS_8501",
    database: "planning",

    options:{
        trustServerCertificate:true,
        enableArithPort: true,
       
    },
    
    pool: {
        max: 100,
        min: 0,
        idleTimeoutMillis: 30000,
    },

};

export default config;