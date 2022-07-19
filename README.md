# Agora Web Watchparty

Use a Agora Extension for background removal with HTML Canvas to composite the videos on top of any media.  
This project is built with React and the [Agora Web UIKit](https://github.com/AgoraIO-Community/Web-React-UIKit/).

## How To Use
Add your Agora App ID (and channel token) to `./src/App.tsx`.  
You can start the project by executing `npm i && npm start`.  

Example:
![screenshot](sc.png)

## Helpful curl commands

You can generate auth_phrase as base64 encoded string REST_KEY + ':' + 'REST_SECRET'.

You can login to the Agora Developer Dashboard (http://dashboard.agora.io), and navigate to the \"RESTful API\" menu to get these values.

List
```bash
curl 'https://api.agora.io/v1/projects/<App_ID>/cloud-player/players' -H "Acess-Control-Allow-Origin: *" -H "Authorization: Basic <Your_Auth_Phrase>" -H "Content-Type: application/json"
```
Delete
```bash
curl -X DELETE 'https://api.agora.io/na/v1/projects/<App_ID>/cloud-player/players/<Player_ID>' -H "Acess-Control-Allow-Origin: *" -H "Authorization: Basic <Your_Auth_Phrase>" -H "Content-Type: application/json"
```
Start
```bash
curl 'https://api.agora.io/na/v1/projects/<App_ID>/cloud-player/players' -X POST -H "Acess-Control-Allow-Origin: *" -H "Authorization: Basic <Your_Auth_Phrase>" -H "Content-Type: application/json" --data-binary '{"player":{"streamUrl":"<Video_URL>","channelName":"test","token":null,"uid":1,"idleTimeout":300,"name":"test"}}'
```