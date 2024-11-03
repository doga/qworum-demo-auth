![Qworum logo and name](https://raw.githubusercontent.com/doga/qworum-website/master/build/assets/images/logos/Qworum-logo-and-name.svg "Qworum logo and name")

# Demo of a Qworum service that does user authentication

## Qworum API endpoints

- the `home` endpoint, which is a test application.
- the `sign-in` endpoint, called by `home`.
- the `sign-up` endpoint, called by `sign-in`.

## Create user credentials

Use this script to populate `dist/data/credentials.json`.

First install these:

1. [Deno 2+](https://deno.com/)
1. [MDRB](https://jsr.io/@andrewbrey/mdrb)

Then run this:

```shell
mdrb --mode isolated https://raw.githubusercontent.com/doga/qworum-demo-auth/master/README.md
```

This will run the following script:

<details data-mdrb>
<summary>Create SHA-256 digests from cleartext passwords.</summary>
<pre>
description = '''
This script will not touch the filesystem.
'''
</pre>
</details>

```javascript
const
algorithm = 'SHA-256',
prompt    = 'Password? (leave empty to exit)',

digest = async (message) => {
  const 
  msgUint8   = new TextEncoder().encode(message),                 // encode as (utf-8) Uint8Array
  hashBuffer = await crypto.subtle.digest(algorithm, msgUint8),   // hash the message
  hashArray  = Array.from(new Uint8Array(hashBuffer)),            // convert buffer to byte array
  hashHex    = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
};

while(true){
  const password       = await $.prompt(prompt); if(password.length === 0) break;
  const passwordDigest = await digest(password);
  console.info(`Password:\n  ${password}\n${algorithm} digest in hexadecimals:\n  ${passwordDigest}\n`);
}
```

Sample output:

```text
Password:
  password
SHA-256 digest in hexadecimals:
  5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
```

## License

This software is released under the terms of the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

∎
