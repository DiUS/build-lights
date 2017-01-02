# Build lights web controller
A web application to ease the configuration of your build lights.

![jobs configuration](https://github.com/DiUS/build-lights/blob/master/docs/jobs.png)

## What you need
- Raspberry Pi (:grin:)
- Node JS ( `>= 4` )

## How to get it going
Before anything you will need a configuration file. Create one at your preferred location in the file system.  There are examples in the `fixtures` directory.

This application uses [RollupJS](rollupjs.org) to create a bundle with front end logic and a few assets. It also runs an Express server serving such assets.

- Express serves a basic HTML page
- This HTML page contains a link at the bottom to `bundle.js`
- Rollup bundles up front end logic and components, with styles
- CSS is processed using PostCSS with a bunch of plugins
- Once processed the HTML page has its inline styles updated
- `bundle.js` is created

To get all this going...
- Clone this repo
- Change to the `web-controller` directory
- Run `yarn` to install dependencies
- Run `yarn run dev:client`
- Run `node ./src/server/index.js /path/to/web-configuration.json /path/to/light-configuration.json`
- Point your browser to (http://localhost:3000)

**Note:** if you create `web-configuration.json` in the same directory as `web-controller` then you can run `yarn run dev:server` and enjoy a dashboard with [nodemon](http://npmjs.com/package/nodemon)

## To run tests
You can run `npm test` and here's what's going to happen:

1. Run lint using [Standard JS](http://standardjs.com/)
2. Run [JSCPD](https://github.com/kucherenko/jscpd)
3. Run all tests (suffixed with `.spec.js`)
