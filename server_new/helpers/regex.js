const email_validation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const hour_minutes_validation = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

const hex_color_validation = /^#([0-9a-f]{6}|[0-9a-f]{3})$/;

export {
    email_validation,
    hour_minutes_validation,
    hex_color_validation
};