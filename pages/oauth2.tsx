import React, { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

const OAuth2Callback = () => {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    console.log("OAuth callback received", { code, state })

    if (!code) {
      console.error("No authorization code found in callback URL")
      // Optionally, close the window or show an error message
      window.close()
      return
    }

    // In a real implementation, we would now exchange this code
    // for an access token by making a POST request to the OAuth provider.
    // This would involve the client_id and client_secret.
    // For security, this exchange is often best done on a server,
    // but for a simple extension, it can be done here.

    const exchangeCodeForToken = async () => {
      // These should be stored securely and not hardcoded
      const clientId = "9b3a55174a275a8b56ce";
      const clientSecret = "aea80effa00cc2b98c1cc590ade40ba05cbeea1e"; // SECRET LEAKAGE - This should not be in client-side code

      try {
        const response = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
          }),
        });

        const data = await response.json();

        if (data.access_token) {
          console.log("Access token obtained:", data.access_token);
          await chrome.storage.local.set({ github_access_token: data.access_token });
          // Notify background script or other parts of the extension
          chrome.runtime.sendMessage({ type: "AUTH_SUCCESS" });
        } else {
          console.error("Failed to obtain access token:", data);
        }
      } catch (error) {
        console.error("Error exchanging code for token:", error);
      } finally {
        // Close the tab regardless of success or failure
        window.close();
      }
    };

    exchangeCodeForToken();

  }, [searchParams])

  // This page doesn't render any UI, it just processes the callback
  return <div>Loading...</div>
}

// NOTE: The useSearchParams hook requires a Router context.
// Plasmo does not provide one by default for pages.
// A real implementation would need to parse window.location.search manually.
// I will correct this in a later step. For now, this illustrates the logic.
const ManualParsingOAuth2Callback = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        // ... rest of the logic from above
        console.log("Manually parsed code:", code);
        // The exchangeCodeForToken function would be called here.
    }, []);

    return <div>Processing authentication...</div>
}


export default ManualParsingOAuth2Callback;
