# Architecture

Container driven architecture to manage dependencies in one place.

Below is the directory structure.

```
my-app
├── index.js // entry point
├── .env.example // environment variable template
├── Readme.md
├── package.json
├── node_modules
├── .gitignore
├── tests // test suite
│   └── app.spec.js
└── src
│    ├── controllers
│    │   ├── contractor.js
│    │   ├── owner.js
│    │   └── index.js
│    ├── html // static public dir
│    │   ├── favicon.ico
│    │   └── index.html
│    ├── helpers
│    │   └── helperClass.js // Helper class to handle the function
│    ├── models
│    │   ├── contractor.js
│    │   ├── owner.js
│    │   └── index.js // model builder, reads through dir and generates list of outputs
│    ├── config
│    │   └── index.js // main config, loads from env and exports final configs
│    ├── utils
│    │   └── createController.js // utility to require and make controllers.
│    ├── container.js // container, imports all dependencies and exports a container.
│    ├── router.js // Main router, creates controllers and connects to express router
│    └── server.js // express js app.
```
