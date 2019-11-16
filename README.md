# bloch

Blockchain in TypeScript

## Information

Do not try to use this as a real cryptocurrency. It is a naive, bare-bones implementation of a blockchain with a cryptocurrency stored in the blocks and it is in no way guaranteed to be secure.

It was created for a presentation at Youngstown State University's Local Hack Day 2019. Slides are in the `/docs` folder.

All the fundamental technologies are present, including a blockchain with hash pointers, peer-to-peer networking, and a consensus mechanism.

## Building

Look in `package.json` for the scripts.

- `yarn run build` - check the types and code style, run unit tests, and compile TypeScript (from `/src`) to JavaScript (in `/lib`)
- `yarn run build-docker-image` - builds the Docker image using the `Dockerfile` configuration

Run three miners by building the docker image and then running `docker-compose up`

Use Postman or curl to send transactions or check wallet balance, block chain state, or mempool state.
