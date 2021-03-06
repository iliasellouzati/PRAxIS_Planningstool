import moment from 'moment';

const SideBarLinks = [
    {
        "naam": "home",
        "icon": "fas fa-home",
        "link": "/"
    },
    {
        "naam": "planningen",
        "icon": "fas fa-table",
        "link": "/planningen/"+moment().format("YYYY")
    },
    {
        "naam": "werknemers",
        "icon": "fas fa-robot",
        "link": "/werknemers"
    },
    {
        "naam": "shifttypes",
        "icon": "fas fa-list-ol",
        "link": "/shifttypes"
    },
    {
        "naam": "contracttypes",
        "icon": "far fa-address-card",
        "link": "/contracttypes"
    },
    {
        "naam": "weekstructuren",
        "icon": "fas fa-puzzle-piece",
        "link": "/weekstructuren"
    },
    {
        "naam": "feestdagen",
        "icon": "fas fa-cogs",
        "link": "/feestdagen/"+moment().format("YYYY")
    }
]

export {
    SideBarLinks
}