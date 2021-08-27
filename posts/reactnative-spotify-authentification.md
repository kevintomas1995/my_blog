---
title: Spotify Authentication with ReactNative
excerpt: Authenticating Spotify users in your ReactNative app with expo-auth-session!
image: spotify-blog.png
isFeatured: true
date: '2021-08-27'
---
## Intro
When I first started this project, I faced the problem that there were not as much as tutorials on authenticating Spotify users as I expected. That's why I decided on publishing my approach to this problem.

![Project Pic](spotify.png)

This will be a series of two articles. In the first one I'm going to go through the authentication process with Spotify, ReactNative and expo-auth-session. The second part will be about displaying and playing your personal current top 20 songs in form of tinderlike swipecards. For a quick demo watch this [video](https://www.youtube.com/watch?v=UmSQqXhGjkA).

The whole project can be found [here](https://github.com/kevintomas1995/spotify_top_songs_player)

![Project Pic](spotify.png)

## Setup
Before we can dive in to the code, we first have to set up some things concerning Spotify. Go to [this site](https://developer.spotify.com/dashboard/applications) and log in with your Spotify account. After that, create an app. From the following screen you will later need the **client id**.

![App overview](spotify1.png)

Next, you need to go the **"Edit Settings"** screen. There, you need to insert a redirect URI. In my case it is "exp://127.0.0.1:19000/", since I'm working with expo on my local machine.

![Edit Settings](spotify2.png)

