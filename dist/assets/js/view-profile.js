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
  returnButton = document.getElementById('return-button'),
  listUi       = document.getElementById('list'),
  returnScript = Script(Return(Json({}))),
  profile      = await Qworum.getData(['@', 'profile']);

  console.debug(`profile: ${profile}`);
  console.debug(`profile.value.displayName: ${profile.value.displayName}`);

  if(!profile){
    await Qworum.eval(returnScript);
    return;
  }

  returnButton.addEventListener('click', async (event) => {
    event.preventDefault();
    await Qworum.eval(returnScript);
  });

  // <md-list-item
  //     type="link"
  //     href="https://google.com/search?q=buy+kiwis&tbm=shop"
  //     target="_blank">
  //   <div slot="headline">Shop for Kiwis</div>
  //   <div slot="supporting-text">This will link you out in a new tab</div>
  //   <md-icon slot="end">open_in_new</md-icon>
  // </md-list-item>

  const
  credUi         = document.createElement('md-list-item'),
  headline       = document.createElement('div'),
  supportingText = document.createElement('div'),
  icon           = document.createElement('md-icon')
  ;

  headline.setAttribute('slot', 'headline');
  headline.appendChild(document.createTextNode(profile.value.displayName));
  supportingText.setAttribute('slot', 'supporting-text');
  supportingText.appendChild(document.createTextNode(profile.value.username));
  icon.setAttribute('slot', 'end');
  icon.appendChild(document.createTextNode('user_attributes'));
  credUi.appendChild(headline);
  credUi.appendChild(supportingText);
  credUi.appendChild(icon);

  listUi.appendChild(credUi);

}
