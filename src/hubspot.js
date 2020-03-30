import config from './config.js'
import qs from 'qs'
const sendRequest= (url, method, header, data) => {
    return new Promise((resolve, reject) => {
        kintone.proxy(url, method, header, data, (resp) => {
            resolve(resp)
        }, (error) => {
            reject(error)
        });
    })
}

const hubspot = {
    getAuthorizationUrl: () => {
        const authorizationUrlParams = {
            client_id: config.clientId,
            redirect_uri: config.redirect_uri,
            scopes: config.scopes,
          };
          return `${config.oAuthURL}${qs.stringify(authorizationUrlParams)}`
    },
    getAccessToken: (params) => {
        const initialData = {
            'grant_type': 'authorization_code',
            'client_id': config.clientId,
            'client_secret': config.clientSecret,
            'redirect_uri': config.redirect_uri,
        }
        const header = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        const data = Object.assign({}, initialData, params)
        return sendRequest(config.tokenUrl, 'POST', header, qs.stringify(data))
    },
    getContacts: () =>{
        const header = {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
        }
        return sendRequest(config.contactUrl, 'GET', header, {})
    },
    extractUrlValue: (key, url) => {
        if (typeof (url) === 'undefined')
          url = window.location.href;
        var match = url.match('[?&]' + key + '=([^&]+)');
        return match ? match[1] : null;
    },
}
export {hubspot}