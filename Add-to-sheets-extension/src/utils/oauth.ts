export async function launchGoogleAuth(scopes: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const CLIENT_ID =
      "1040032985418-7h3iq9cedojrcj1cc0enjee5qagpqh8e.apps.googleusercontent.com"; // <-- replace this
    if (!CLIENT_ID) {
      reject(new Error("Please set CLIENT_ID in src/utils/oauth.ts"));
      return;
    }

    const redirectUri = chrome.identity.getRedirectURL(); // e.g. https://<ext-id>.chromiumapp.org/
    const scope = encodeURIComponent(scopes.join(" "));
    const state = Math.random().toString(36).slice(2);

    // use implicit flow to get access_token in redirect fragment
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(CLIENT_ID)}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${scope}` +
      `&prompt=consent` +
      `&state=${encodeURIComponent(state)}`;

    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      (redirectUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || "Auth failed"));
          return;
        }
        if (!redirectUrl) {
          reject(new Error("No redirect URL returned"));
          return;
        }
        // redirectUrl contains fragment: #access_token=...&expires_in=...
        const hash = redirectUrl.split("#")[1] || "";
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const error = params.get("error");
        if (error) {
          reject(new Error(error));
          return;
        }
        if (!accessToken) {
          reject(new Error("No access_token found in response"));
          return;
        }
        // Cache token in chrome.storage.local for reuse until expiry (simple caching)
        chrome.storage.local.set({ google_token: accessToken });
        resolve(accessToken);
      }
    );
  });
}

export async function getStoredToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["google_token"], (res) => {
      resolve(res.google_token || null);
    });
  });
}
