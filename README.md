# Mirir: Interactive Educational Platform for Learning

## Project Description

Mirir is an interactive educational platform designed to enhance student engagement through the integration of gamification elements. The project emerged from a needs analysis conducted at the Scuola Universitaria Professionale della Svizzera Italiana (SUPSI), which actively involved both students and faculty. This analysis revealed that currently available solutions (such as Kahoot or Wooclap) do not fully meet the accessibility, continuity, and free-of-charge requirements demanded by the academic context.

The platform has been built using a microservices architecture: the backend is implemented in Java with the Quarkus framework, optimized via GraalVM to ensure high performance and fast startup times; data are managed by MongoDB, a document-oriented NoSQL database.

The frontend, developed in React and TypeScript, communicates with the backend through REST APIs defined with OpenAPI and handled via Axios. The entire system is containerized with Docker and deployed on Google Cloud Platform using Cloud Run, providing a fully cloud-native, serverless setup. Authentication is managed through Microsoft Azure Entra ID, with future plans to integrate with SUPSI's institutional systems.

The development process followed an iterative, Agile-inspired approach combined with user-centered design, featuring continuous prototyping cycles and qualitative feedback loops.

The current release supports the creation of courses organized into thematic folders, the creation and publication of asynchronous quizzes, management of a shared question bank, question import, and display of both aggregated and individual statistics. Currently supported question types are true/false and multiple choice.

All project objectives have been successfully met, and the final version has been positively validated by a representative group of SUPSI students and faculty.

## Main Features

- Creation and management of courses organized into thematic folders
- Creation and publication of asynchronous quizzes
- Management of a shared question bank
- Question import functionality
- Display of both aggregated and individual statistics
- Support for true/false and multiple choice question types
- Authentication through Microsoft Azure Entra ID

## Technologies Used

### Backend
- Java with Quarkus framework
- GraalVM for optimization
- MongoDB (NoSQL database)
- OpenAPI for REST API definition

### Frontend
- React
- TypeScript
- Axios for API communication
- Vite as build tool

### Deployment
- Docker for containerization
- Google Cloud Platform (Cloud Run)
- Microsoft Azure Entra ID for authentication

## Installation

The project uses React with Vite, requiring npm version 11.3.0. The setup follows standard Vite application conventions.

### Development Setup

*Backend:*
``` bash 
cd backend
mvn clean package
cd target/backend-api-client
npm i
npm link
cd ....
mvn quarkus:dev
```

*Frontend:*
``` bash
npm i
npm link @dti-isin/backend-api-client
npm run dev
```


### Testing

*Backend tests:*
``` bash
mvn quarkus:test
```

*Frontend tests:*
``` bash
npm run test
# For coverage report
npm run coverage
```

## Usage

The application is accessible at: [https://frontend-service-1031980811194.europe-west12.run.app/](https://frontend-service-1031980811194.europe-west12.run.app/)

Users can perform all operations described in the project description:
- Create and manage courses and thematic folders
- Create and publish asynchronous quizzes
- Manage the shared question bank
- Import questions
- View aggregated and individual statistics
- Create true/false and multiple choice questions

## Project Structure

![Project Structure](./screenshots/general-architecture.png)
![Project Structure](./screenshots/general-architecture-cloud-native.png)