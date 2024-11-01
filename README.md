# How to run locally
- Update `root-project-folder/node_modules/rebilly-js-sdk/package.json`, add `"type": "module"` into this file
- Update `root-project-folder/package.json`, add `"type": "module"` into this file. Please don't make a commit for this change, or else it breaks the deployment on Vercel. I don't know why 🤷 
- `yarn dev` works 🎉
