## Developing

truffle has to be compiled 1st

```
npm i
npm run dev
```

## Building and deploying

```
next build
next export
```

And then deploy the `out` folder (e.g. to S3)

## Deploy

```
next build && next export -o public && firebase deploy --project fnft-demo
```
