import {hubspot} from './hubspot'
import {Record} from '@kintone/kintone-js-sdk'
import {Button} from '@kintone/kintone-ui-component/esm/js'


kintone.events.on('app.record.index.show', (event) => {
    const oauthCode = hubspot.extractUrlValue('code');

    if (!oauthCode) {
        const oauthBtn = new Button({text: 'Oauth Hubspot'})
        oauthBtn.on('click', () => {
            window.location.replace(hubspot.getAuthorizationUrl());
        })

        const spaceEl = kintone.app.getHeaderMenuSpaceElement();
        spaceEl.appendChild(oauthBtn.render());

        return event;
    }

    return hubspot.getAccessToken({code: oauthCode}).then((rsp) => {
        localStorage.setItem("access_token", JSON.parse(rsp).access_token);
        return hubspot.getContacts()
    }).then((rsp) => {
        const contacts = JSON.parse(rsp).contacts;
        let records = []
        for (let i = 0; i < contacts.length; i++) {
            const item = contacts[i];
            const rc = {
                url: {value: item['profile-url']},
                company: item.properties.company,
                name: item.properties.lastname,
                mail: item['identity-profiles'][0] ? item['identity-profiles'][0]['identities'][0] : {value: 'bh@hubspot.com'}
            }
            records.push(rc);
        }
        
        const record = new Record();
        return record.addRecords({app: 12, records: records})
    }).then(() => {
        window.location.replace(`https://vuhuykhanh-3.cybozu-dev.com/k/12/`);
    }).catch(err => {
        console.log(err);
    })
  });