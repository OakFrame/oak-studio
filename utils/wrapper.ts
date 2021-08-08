export function isApplicationWrapped() {
    return (document.location.protocol != "http:" && document.location.protocol != "https:") || (document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1);
}


export function isHTTPS() {
    return (window.location.protocol == "https:")
}
