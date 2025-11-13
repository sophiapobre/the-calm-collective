### Getting Started

1. **Clone this repo.**

2. **Build and start all services by running the following command in your terminal:**
   ```sh
   docker compose up --build
   ```
   Please note that it may take several minutes for the app to be ready, as I have written several import scripts that seed data into the database. You will know that it is ready if you see the following message. Alternatively, you can proceed to the next step and check if the product images appear on the homepage to confirm that the imports have finished.
   ```sh
   backend-1   | All import scripts completed.
   backend-1   | Server is running on port 4000
   ```

3. **Access the app:**
   - Launch your browser and go to [http://localhost:3000](http://localhost:3000) to access the frontend.
   - The backend API will also be available for you to test at [http://localhost:4000](http://localhost:4000).

4. **To stop running the app, press `Ctrl+C` in the terminal, and then run:**
    ```sh
    docker compose down
    ```
