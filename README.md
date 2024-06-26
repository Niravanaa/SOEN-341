# SOEN-341

| Environment | Status                                                                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Production  | [![Deploy Production](https://github.com/NathanGrenier/SOEN-341/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/NathanGrenier/SOEN-341/actions/workflows/deploy-production.yml)       |
| Develop     | [![Deploy Develop](https://github.com/NathanGrenier/SOEN-341/actions/workflows/deploy-develop.yml/badge.svg?branch=develop)](https://github.com/NathanGrenier/SOEN-341/actions/workflows/deploy-develop.yml) |

## About

This project is a web application built with SvelteKit for car rental services.

The application allows users to browse available cars for rent through a
seamless user-friendly web interface.

> Please note that this project is for educational purposes and is part of a
> university assignment. It's not intended for commercial use.

### Features

1. **User-Friendly Interface:** Creating a clean and easy interface to navigate
   allows the user to browse, select and rent cars effortlessly.
2. **Data Security:** Implementing a robust security system to protect personal
   data such as credit card information is crucial to maintain trust.
3. **Availability across Devices:** Implements and endure that the car rental
   website is accessible and adaptable to different screen sizes.
4. **Integration with maps:** Since we will be creating a web-based car rental
   application we will need to integrate with maps. This integration is crucial
   since it will be easier for the user to find the rental location and drop off
   points.

## Team Members and their Roles

| Name            | Student ID | Role     |
| --------------- | ---------- | -------- |
| Nathan Grenier  | 40250986   | Devops   |
| Brian Tkatch    | 40191139   | Devops   |
| Annabel Zecchel | 40245507   | Frontend |
| Jeremy Crete    | 40246576   | Frontend |
| David Carciente | 40247907   | Backend  |
| Nirav Patel     | 40248940   | Backend  |

### More on Roles

Roles are not strictly upheld. The nature of the project's framework (SvelteKit)
makes it so every member touches on multiple aspects of the project during
development.

## Project Approach

This projects approach has been outlined in the **SvelteState’s Project Approach
and Technology Document**.

This document can be accessed in 2 places:

1. In this repo as a pdf named
   `SvelteState’s Project Approach and Technology Document`
2. As a Microsoft word document through
   [this link 🔗](https://liveconcordia-my.sharepoint.com/:w:/g/personal/na_greni_live_concordia_ca/ET7er7FnYrJLqkYusEczgAYB2VaqA-2ry3Y7Dj7YUjQIUQ?e=SHa4Ia)
   > Make sure to use your Concordia email to access the document.

## Technology Used

The decision to use certain technologies was described in the
[Project Approach section](#Project-Approach).

The full list of technologies used with explanations for their purpose in the
project can be found on
[this wiki page](https://github.com/NathanGrenier/SOEN-341/wiki/Technologies-Used-in-Project).

## Meeting Minutes

A detailed record of the meetings conducted by the team can be viewed through
the following
[wiki page](https://github.com/NathanGrenier/SOEN-341/wiki/Meeting-Minutes).

## Development

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

### VSCode Setup

1. Install the `Svelte for VS Code` and `Svelte Intellisense` VSCode Extensions
2. Install the `Prisma` VSCode Extension
3. Install the `Tailwind CSS InteliSense` VSCode Extension
4. Install the `Prettier` VSCode Extension
5. Configure Prettier to format on save in VSCode's settings by adding this
   configuration to you VSCode settings.json file (accessible through settings)

```json
   "editor.formatOnSave": true,
   "[svelte]": {
      "editor.defaultFormatter": "svelte.svelte-vscode"
   },
   "[prisma]": {
      "editor.defaultFormatter": "Prisma.prisma"
   },
```

6. Another useful extension for live collaboration is `Live Share`

### Installing Docker

A docker container is used in development to create a dev database. You'll need
to [install](https://docs.docker.com/desktop/install/windows-install/) docker on
your computer to be able to use the necessary commands.

### Environment Variables

Secrets and other configuration values are managed through environment
variables. When developing locally, they can be configured by creating a `.env`
file in the project's root.

> **Note**: Default values should be optimized for local development, such that
> a developer can clone and run the project successfully without having to
> override any configuration values.

The following variables can be configured:

| VAR                 | DESC                                                 | DEFAULT                                                                                 |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| DB_HOST             | The dev database host                                | `localhost`                                                                             |
| DB_USER             | The dev database username                            | `devuser`                                                                               |
| DB_PASSWORD         | The dev database password                            | `supersecret`                                                                           |
| DB_NAME             | The dev database name                                | `devdb`                                                                                 |
| DB_PORT             | The dev database port                                | `5432`                                                                                  |
| DATABASE_URL        | The database URL (used by Prisma)                    | `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public` |
| DIRECT_DATABASE_URL | Used in development environment to keep Prisma happy | `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public` |
| FAKE_AUTH_PASSWORD  | The password that is required on the fake login page | `changeme`                                                                              |
| USE_FAKE_AUTH       | Set to `true` to bypass authentication               | `true`                                                                                  |
| EXEC_ENV            | Current execution environment                        | `development`                                                                           |
| SESSION_SIGNING_KEY | 32 random bytes in hex format, used to sign sessions | `480c67189f5ddb38a2b9993724e0327da90467de5628cd3897e579af71d6e7d8`                      |
| SMTP_HOST           | Hostname of the SMTP server                          | `smtp.ethereal.email` is a good test service                                            |
| SMTP_PORT           | Port used to connect to the SMTP server              | `587`                                                                                   |
| SMTP_USER           | Username to authenticate to the SMTP server          | `my@account.email`                                                                      |
| SMTP_PASS           | Password to authenticate to the SMTP server          | `password`                                                                              |

### Starting the Dev Environment

Use
[nvm](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/)
to install the proper version of node for the project (can be found in
`package.json` in the `engines` object):

```bash
nvm install 18
```

Install the node dependencies:

```bash
npm install
```

Use docker compose to start the development database:

```bash
docker compose up

# or run the docker container in detached mode (runs in the background)
docker compose up -d
```

Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Pre-commit Hook with Husky

In order to initialize the pre-commit hook used in the project, use the
following command:

```bash
npx husky install
```

### Prisma

#### Prototype Database Change:

To prototype a change to the Prisma schema and sync the modification with your
development database, use the following command:

```bash
npx prisma db push
```

#### Create Database Migration:

When the Prisma schema is in a stable condition (in the desired state), create a
[migration](https://www.prisma.io/docs/orm/prisma-migrate/getting-started) file
with:

```bash
prisma migrate dev
```

This migration file can then be used to update the databases in other
environments (preview, production).

For more detail, visit the
[Prisma Docs](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema)
on the topic.

#### Seeding

To seed you local database during development, use this command:

```bash
npx prisma db seed
```

> **Note:** Preview deployments will automatically be seeded during the
> workflow.

#### Exploring the Database in Development:

If you want to see a visual representation of the database, use the
[Prisma Studio](https://www.prisma.io/docs/orm/tools/prisma-studio) tool by
running:

```bash
npx prisma studio
```

### Blob Storage

This project uses Vercel's blob storage to host images (most notably of cars).

You can read the docs on how to use the API calls
[here](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk).

> **Note:** There's a limit on the server upload (4.5MB). Make sure to handle
> this properly. See the
> [docs](https://vercel.com/docs/storage/vercel-blob/server-upload) for more
> details.

> Make sure to set the new environment variables added to the
> [table](#environment-variables).

### Tests

Unit tests are run using the [Vitest](https://vitest.dev/) testing framework.

Launch unit tests by running:

```
npm test
```

### Before Merging

Before you created a merge request, make sure that your code is properly
formatted and linted using the following npm commands (located in `package.json`
under scripts):

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format: `npm run format`

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

A preview environment is created whenever a pull request is created and the
preliminary tests have passed. This can be used to review any changed made in a
production like environment.

Once the pull request is merged, a GitHub action will automatically deploy the
application to [production](https://soen-341.vercel.app/).
