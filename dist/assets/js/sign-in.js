import { Credential, Credentials, digest, defaultDigestAlgorithm } from "./modules/credentials.mjs"; 
import { QworumScript, Qworum } from './deps.mjs';

const
// Data values
Json         = QworumScript.Json.build,
SemanticData = QworumScript.SemanticData.build,
// Instructions
Data     = QworumScript.Data.build,
Return   = QworumScript.Return.build,
Sequence = QworumScript.Sequence.build,
Goto     = QworumScript.Goto.build,
Call     = QworumScript.Call.build,
Fault    = QworumScript.Fault.build,
Try      = QworumScript.Try.build,
// Script
Script = QworumScript.Script.build;

// console.debug('hi');

await build();

async function build() {
  // console.debug(`[home] showing ${items.length} items`);
  const 
  signInButton = document.getElementById('sign-in-button'),
  cancelButton = document.getElementById('cancel-button'),
  creds        = await Credentials.read(),
  listUi       = document.getElementById('list');
  // console.debug('creds',creds);

  cancelButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await Qworum.eval(
      Script(
        Fault('cancelled')
        // Return(Json('cancelled'))
      )
    );
  });

  signInButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const 
    username = document.getElementById('username').value,
    password = document.getElementById('password').value,
    cred     = creds.credentials.find(cred => cred.username === username);

    if(!cred){
      console.debug(`Unknown user "${username}".`);
      return;
    }

    console.debug(`user:`,cred);

    const passwordDigest = await digest(password, cred.passwordDigestAlgo);
    if(passwordDigest !== cred.passwordDigest){
      console.debug(`Wrong password.`);
      return;
    }

    console.debug(`user is ${username}`);
    const user = Json({username, displayName: cred.displayName});
    await Qworum.setData(['@', 'profile'], user);
    await Qworum.eval(
      Script(
        Return(user)
      )
    );

  });

  // for (const cred of creds.credentials) {
  //   // console.debug(`[home] showing item ${i}`);

  // // <md-list-item
  // //     type="link"
  // //     href="https://google.com/search?q=buy+kiwis&tbm=shop"
  // //     target="_blank">
  // //   <div slot="headline">Shop for Kiwis</div>
  // //   <div slot="supporting-text">This will link you out in a new tab</div>
  // //   <md-icon slot="end">open_in_new</md-icon>
  // // </md-list-item>

  //   const
  //   credUi         = document.createElement('md-list-item'),
  //   headline       = document.createElement('div'),
  //   supportingText = document.createElement('div'),
  //   icon           = document.createElement('md-icon')
  //   ;

  //   headline.setAttribute('slot', 'headline');
  //   headline.appendChild(document.createTextNode(cred.username));
  //   supportingText.setAttribute('slot', 'supporting-text');
  //   supportingText.appendChild(document.createTextNode(cred.passwordDigest));
  //   // icon.setAttribute('slot', 'end');
  //   icon.appendChild(document.createTextNode('shield_person'));
  //   credUi.appendChild(headline);
  //   credUi.appendChild(supportingText);
  //   credUi.appendChild(icon);

  //   listUi.appendChild(credUi);

  // }

}
