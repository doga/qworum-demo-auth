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
  const 
  listUi         = document.getElementById('list'),
  signInButton   = document.getElementById('sign-in-button');

  signInButton.addEventListener('click', async () => {
    await Qworum.eval(
      Script(
        Try(
          Sequence(
            // Sign in and store user info
            Data(
              ['@', 'signed-in user'], Call('@', '../sign-in/'),
            ),

            // Return to current URL
            Goto(),
          ),

          // Unset user info if sign-in was cancelled by user
          [{
            catch: ['cancelled'],
            do   : Goto()
          }]
        ),
      )
    );
  });

  try {
    const userdata = await Qworum.getData(['@', 'signed-in user']);
    console.debug(`data: ${userdata}`);

    if (userdata) {
      const
      credUi         = document.createElement('md-list-item'),
      headline       = document.createElement('div'),
      // supportingText = document.createElement('div'),
      icon           = document.createElement('md-icon')
      ;
  
      headline.setAttribute('slot', 'headline');
      headline.appendChild(document.createTextNode(userdata.value.username));
      // supportingText.setAttribute('slot', 'supporting-text');
      // supportingText.appendChild(document.createTextNode(userdata.value.username));
      icon.setAttribute('slot', 'end');
      icon.appendChild(document.createTextNode('shield_person'));
      credUi.appendChild(headline);
      // credUi.appendChild(supportingText);
      credUi.appendChild(icon);
  
      listUi.appendChild(credUi);
    }

  } catch (error) {
    console.debug(`error while reading the current user info: ${error}`);
  }

}
