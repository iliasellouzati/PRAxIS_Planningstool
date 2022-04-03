export default {
    title: 'Planningstool server', // Default title
    theme: 'default.css', // Default styles
    path: '/status',
    spans: [{
        interval: 5, // Every second
        retention: 60 // Keep 60 datapoints in memory
    }],
    chartVisibility: {
        cpu: true,
        mem: true,
        load: false,
        eventLoop: false,
        heap: false,
        responseTime: false,
        rps: false,
        statusCodes: true
    },
    healthChecks: [{
        protocol: 'http',
        host: 'localhost',
        path: '/api/employee/',
        port: '3001'
    }]
}