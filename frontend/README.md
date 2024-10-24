## Getting Started with Node.js and React.js

Please make sure you have node.js installed in the latest version on you computer.

If you don't have node.js installed, go to https://nodejs.org/ and click on `Download Node.js`

Remember to install npm, by typing `npm install` in the terminal on your IDE.

If you have npm installed, you can check the version by typing `npm -v` on your terminal.

Or to make sure you have the latest version on your computer run `npm update` on your terminal. 

## Create `.env` file

Create a copy of the `.env.template` file and rename it to `.env`. This will load up the environment variables the React app needs.

NOTE: Do not include any secrets in the `.env.template` file, its purpose is to provide a template so others can easily provided their secrets as environment variables.

## React Instructions

In the project directory, you can run:

`npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

`npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

`npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

#### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Dependencies 
When installing a library, make sure you add the necessary dependencies into the .json files, otherwise it will fail to compile!

## To be able to use the Password Reset feature:
* Make sure that the '.env' looks like this:
```txt
REACT_APP_BACKEND_URL=http://localhost:8080
```
