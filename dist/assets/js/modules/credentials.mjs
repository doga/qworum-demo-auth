const 
credentialsFilePath    = '/data/credentials.json',
localStorageKey        = 'credentials',
defaultDigestAlgorithm = 'SHA-256',
digest = async (message, algorithm) => {
  const 
  msgUint8   = new TextEncoder().encode(message),                 // encode as (utf-8) Uint8Array
  hashBuffer = await crypto.subtle.digest(algorithm || defaultDigestAlgorithm, msgUint8),   // hash the message
  hashArray  = Array.from(new Uint8Array(hashBuffer)),            // convert buffer to byte array
  hashHex    = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
};

class Credential {
  static fromLoginInfo(username, password){
    return new Credential(username, digest(password), defaultDigestAlgorithm);
  }

  /**
   * @param {string} username
   * @param {string} passwordDigest In hexa
   * @param {(string | undefined)} passwordDigestAlgo SHA-256 if omitted
   */
  constructor(username, passwordDigest, passwordDigestAlgo) {
    this.username           = username;
    this.passwordDigest     = passwordDigest;
    this.passwordDigestAlgo = passwordDigestAlgo || defaultDigestAlgorithm
  }
  toJSON(){
    return {
      username: this.username,
      password: {
        digest: {
          value    : this.passwordDigest,
          algorithm: this.passwordDigestAlgo,
        }
      }
    }
  }
}

class Credentials {
  /**
   * @type {Credential[]}
   */
  credentials = [];

  /**
   * @return {Credentials}
   * @async
   */
  static async read() {
    console.debug(`reading localStorage`);
    // try localStorage
    let data = localStorage.getItem(localStorageKey);
    if (data) {
      data = JSON.parse(data);
      return new Credentials(data);
    }

    // fetch the file
    console.debug(`reading file`);
    const response = await fetch(credentialsFilePath);
    data = await response.json();

    return new Credentials(data);
  }

  constructor(data) {
    if(!data) data = [];
    for (const cred of data)
    this.credentials.push(
      new Credential(
        cred.username, 
        cred.password.digest.value, 
        cred.password.digest.algorithm
      )
    );
  }
  write(){
    localStorage.setItem(localStorageKey, JSON.stringify(this));
  }
  toJSON(){
    return this.credentials.map(cred => cred.toJSON());
  }
}

export {Credential, Credentials, digest, defaultDigestAlgorithm};
