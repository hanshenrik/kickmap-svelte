# kickmap

A map showing concerts in an area. Concerts are fetched from [Songkick](https://www.songkick.com), the map is made with [Mapbox GL](https://www.mapbox.com/).

![Oslo kickmap](https://raw.githubusercontent.com/hanshenrik/kickmap/master/images/kickmap.gif)

# Development

### Serverless API

```
$ nvm use 14 // Make sure this runs with Node 14. If you don't have nvm, make sure 'node -v' echoes '14.x'
$ vercel dev
```

### Frontend

```
$ npm run dev
```

> You might need to run `vercel login` if your token is expired.

# Deployment

Commits on master are automatically deployed with Vercel.
