# Camper Intelligence

This is a [Next.js](https://nextjs.org) project for a camper rental marketplace.

## Getting Started (Development)

This project is set up to run in a Dockerized environment for development.

1.  **Prerequisites:**
    *   [Docker](https://www.docker.com/get-started)
    *   [Docker Compose](https://docs.docker.com/compose/install/)
    *   [Node.js](https://nodejs.org/) (for running npm scripts)
    *   [npm](https://www.npmjs.com/get-npm)

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This command will start the Next.js development server and a MySQL database container. The Next.js app will be available at [http://localhost:3000](http://localhost:3000).

    The `dev` script uses the `docker-compose.dev.yml` file to orchestrate the services. The Next.js application has hot-reloading enabled, so changes to the code will be reflected in the browser automatically.

    To run the Next.js development server without Docker, you can use:
    ```bash
    npm run dev:next
    ```

## Database

The development environment includes a MySQL database. The database is initialized with the schema defined in `db/init.sql`. You can modify this file to change the database schema.

The database credentials are stored in the `.env` file.

## Building and Running in Production

The application can be built and run in a production-like environment using Docker.

1.  **Build the production image:**

    ```bash
    docker-compose -f docker-compose.prod.yml build
    ```

2.  **Run the production container:**

    ```bash
    docker-compose -f docker-compose.prod.yml up
    ```

    This will start the Next.js application in production mode. The application will be available at [http://localhost:3000](http://localhost:3000).

    **Note:** The production setup does not include a database. You will need to provide a `DATABASE_URL` environment variable to connect to a production database.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.