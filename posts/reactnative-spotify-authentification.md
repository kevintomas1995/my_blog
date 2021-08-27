---
title: Spotify Authentication with ReactNative
excerpt: Authenticating Spotify users in your ReactNative app with expo-auth-session!
image: spotify-blog.png
isFeatured: true
date: '2021-08-27'
---
## Intro
When I first started this project, I faced the problem that there were not as much as tutorials on authenticating Spotify users as I expected. That's why I decided on publishing my approach to this problem.

This will be a series of two articles. In the first one I'm going to go through the authentication process with Spotify, ReactNative and expo-auth-session. The second part will be about displaying and playing your personal current top 20 songs in form of tinderlike swipecards. For a quick demo watch this [video](https://www.youtube.com/watch?v=UmSQqXhGjkA).

The whole project can be found [here](https://github.com/kevintomas1995/spotify_top_songs_player)

![Project Pic](spotify.jpg)

## Setup
Before we can dive in to the code, we first have to set up some things concerning Spotify. Go to [this site](https://developer.spotify.com/dashboard/applications) and log in with your Spotify account. After that, create an app. From the following screen you will later need the **client id**.

![App overview](spotify1.jpg)

Next, you need to go the **"Edit Settings"** screen. There, you need to insert a redirect URI. In my case it is "exp://127.0.0.1:19000/", since I'm working with expo on my local machine.

![Edit Settings](spotify2.jpg)

That was all concerning the setup! Let's dive into the code now!

## Login Screen
```js
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet, KeyboardAvoidingView, Text } from "react-native";
import { Button, Image } from "react-native-elements";
import { useEffect, useState } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { useSelector, useDispatch } from "react-redux";
import * as tokenAction from "../store/actions/token";
import axios from "axios";
import * as songAction from "../store/actions/topSongs";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "YOUR_CLIENT_ID",
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: "exp://127.0.0.1:19000/",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          dispatch(songAction.addTopSongs(response));
        })
        .catch((error) => {
          console.log("error", error.message);
        });

      setTimeout(
        () =>
          navigation.replace("Home", {
            token: token,
            other: "blaaaa",
          }),
        500
      );

      dispatch(tokenAction.addToken(token));
    }
  });

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          color: "white",
          marginBottom: "20%",
        }}
      >
        top song player
      </Text>
      <Button
        title="Login with Spotify"
        style={styles.button}
        onPress={() => {
          promptAsync();
        }}
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },

  button: {
    width: 200,
    marginTop: 50,
  },
});
```

If you take a look at the imports you can see that I'm using **redux** for state management, **axios** for data fetching and **expo-auth-session** for the actual authentication. The other imports are pretty standard. 

Generally, we are using the **implicit** [authentication flow](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow). 

```js
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};
``` 

The first constant **discovery** holds two links, which are essential for authentication process. **authorizationEndpoint** will be the link to which you will be redirected once you click the login button. The second one, **tokenEndpoint**, will call the spotify api in order to create a unique spotify token for your current session. 

```js
const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "YOUR_CLIENT_ID",
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: "exp://127.0.0.1:19000/",
    },
    discovery
  );
```

For a detailed explanation of the **useAuthRequest** hook have a look [here](https://docs.expo.dev/guides/authentication/#spotify). The most important things to edit in this code snippet are at first the **clientId**. You must insert your client ID from the setup step. Secondly you need to define **scopes**. This has influence on which spotify api endpoint you can successfully use. Take a look at the [spotify api documentation](https://developer.spotify.com/documentation/web-api/quick-start/). The last important thing here is the **redirectUri**, where you need to insert the url where you want tp redirect your users after successfully connecting to spotify. In my case it is exp://127.0.0.1:19000/. This **MUST** be the same URL like in your settings!

```js
useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);
  ```
  In this section we check wheter the authentication process was successful. If so, we are extracting the access token from the response we get back from the code snippet before and we are storing it. 

  After that we are ready to use the access token to fetch data from the spotify api!

  ```js
  useEffect(() => {
    if (token) {
      axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          dispatch(songAction.addTopSongs(response));
        })
        .catch((error) => {
          console.log("error", error.message);
        });

      setTimeout(
        () =>
          navigation.replace("Home", {
            token: token,
            other: "blaaaa",
          }),
        500
      );

      dispatch(tokenAction.addToken(token));
    }
  });
  ```

  At this point we are making a call to the [top tracks endpoint](https://developer.spotify.com/console/get-current-user-top-artists-and-tracks/?type=artists) in order to get the current top songs. In the headers, we are using the access token to get access to this endpoint. Additionally, I'm dispatching the top songs and the access token to the redux stores. Since we only have two screens this isn't quite necessary and you could alternatively pass the data through your components. Still, if the app will get more complex this can get very useful. In a last step, we are replacing the Login Screen with the Home Screen.

  The rest of the code is really pretty standards ReactNative code!

  ## Conclusion
  In the second part of this series we will 