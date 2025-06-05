# Property Rental System (Casa de sus Sueños) - Frontend

This project is the frontend application for a property rental system built with Angular CLI version 16.2.16. It's part of a microservices architecture that communicates with backend services through an Nginx gateway.

## Architecture Overview

This Angular application serves as the frontend for a microservices-based property rental platform. All API requests are routed through an **Nginx gateway** that manages communication with the backend microservices.

### Backend Communication
- **Gateway URL**: `http://10.43.103.226`
- **Property Search Service**: `http://10.43.103.226/propiedades`
- **Rental Service**: `/renta`

The application handles:
- Property search and filtering
- Property details viewing
- Rental application submissions
- Property owner information display

## How to run it?

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (version 14 or higher)
- **npm**
- **Angular CLI** (version 16.2.16)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alquilar-propiedad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally** (if not already installed)
   ```bash
   npm install -g @angular/cli@16.2.16
   ```

### Running the Application

1. **Start the server**
   ```bash
   ng serve
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:4200/
   ```

## Features

- **Property Search**: Browse and filter available properties
- **Property Details**: View property information
- **Owner Information**: Display property owner contact details
- **Rental Applications**: Submit rental requests
