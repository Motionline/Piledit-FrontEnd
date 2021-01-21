interface ConfigIF {
  apiKey?: string;
  authDomain?: string;
  storageBucket?: string;
  databaseURL?: string;
  projectId?: string;
  messagingSenderId?: string;
}

export interface CredentialsIF {
  config: ConfigIF;
}
