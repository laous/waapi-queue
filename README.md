# waapi-queue

## Tech Stack

- Node v18.7.0

### Backend

- Typescript
- Express
- Prisma (MongoDB)
- Jest
- node-cron (To run some tasks every 2 minutes or every 24 hours)

### Frontend

- Typescript
- React
- TailwindCSS
- Tanstack-Query
- React-Hook-Form
- Zod

## Installation

- Make sure that ports 3000 and 8080 are free to use.
- Install dependences using `npm install` on both folders(client, server).
- To run the project, use `npm run start` from the root.
- To run backend tests, use `npm run test` either from the root or after navigating to server.

## Features

- A user can create a new account, or log in with an existing one.
- A user can see the actions the system provides, the credit he have on each one of them.
- A user can see his queue, and can add actions to it accordinly.
- A user can see the time left for the credits to be re-calculated.
- A user can add actions to his queue even though he has no credits left.
- A user can logout.
- A user won't be able to access a dashboard unless he is authenticated.
- The system will calculate action credits for a user when he first creates his account.
- The system will only execute actions which the user have enough credits for.
- Each action executed successfully will remove for credit from the user's solde for it.
- If the user has a full queue and no credits left, actions will be left there until there is some credits.
- The system creates new actions if their collection in db is empty.
- The system execute the next available action for each user each 2 minutes.
- The system re-calculates the credits for each user each 24 hours.

## Potential Improvements

### Technical

- Improve the logging part in the server part.
- Implement custom error handler.
- Implement a caching solution instead of calling the db every time.
- Give the user more feedbacks to his action in the frontend
- Better handle authentication; use something other than localstorage on frontend, and implement expiration and refresh token on backend.
- Create components for buttons, inputs used.
- Add Docker to facilitate tasks (like deployement, ease to use and run for others..)
- Set up multiple enviroments(dev-testing-prod)
- Add more tests to the server part.
- Test the frontend.

### Functional

- Create a new collection that will act like a system, it will have it's own actions and users.
- Cost of an action's execution to depend on the action.
- Ability to delete an action from the queue.
