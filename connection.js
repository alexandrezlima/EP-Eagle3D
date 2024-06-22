window.connect = async function() {
    try {
        const apiKey = "U2FsdGVkX18945f4r2ARI3tF+rf3TOCqMiiT985gKFteJ8v9E0zSohGE8ornH9Wa4sD7+W5N2jjCvFTCz/BNZX8Sqe29lNn3ehWHRWksndwIr7cK6MjaSZXXzxwGUyXwEKSJi0Cjoexs++WemI1DMwE0wEJoZIsw9tRkSJFVU9s=";
        const tokenExpiryDuration = 60000;
        const clientUserName = "Mile80";
        const streamingAppInfo = {
            "core": {
                "domain": "connector.eagle3dstreaming.com",
                "userName": clientUserName,
                "appName": "Test",
                "configurationName": "testconfig"
            }
        };

        const response = await axios.post(
            "https://token.eaglepixelstreaming.com/api/v1/token/create",
            {
                "object": streamingAppInfo,
                "expiry": tokenExpiryDuration,
                "client": clientUserName
            },
            {
                headers: { "Authorization": "Auth " + apiKey }
            }
        );

        if (response.data.error) {
            console.error("Error fetching token:", response.data.error);
            return;
        }

        var mytoken = response.data.token;
        var myusername = "Mile80";
        e3ds_controller.main(mytoken, myusername);
    } catch (error) {
        console.error('Error fetching token:', error);
    }
}