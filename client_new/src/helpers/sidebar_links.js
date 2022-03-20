import moment from 'moment';

const SideBarLinks = [
    {
        "naam": "home",
        "icon": "fas fa-home",
        "link": "/"
    },
    {
        "naam": "automatisch",
        "icon": "fas fa-magic",
        "link": "/automatisatie/2021/03"
    },
    {
        "naam": "manueel",
        "icon": "fas fa-magic",
        "link": "/manueel"
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
        "naam": "instellingen",
        "icon": "fas fa-cogs",
        "link": "/instellingen"
    },
    {
        "naam": "rapporten",
        "icon": "fas fa-file-exc-el",
        "link": "/rapporten"
    }
]

export {
    SideBarLinks
}