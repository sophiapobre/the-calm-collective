# Assignment 3

by Sophia Pobre

This project is a data-driven e-commerce website called RandomShop, which carries items from 3 random categories: Shoes, Electronics, Bags.

### Pages 

- **Home:** Directly links to the Categories, Best Sellers, Search, Admin, and Cart pages.
  - Every time the Home page is visited, the banner displays images of 3 randomly selected products from the "Best Sellers" category.
  - The "Shop now" button in the banner links to the Best Sellers page.
- **Categories:** A list of all products under each category, displayed as product cards. Each product's image and title can be clicked to view that product's details page.
  - NOTE: This page does not display the "Best Sellers" category because there is a separate "Best Sellers" page accessible from the navbar.
- **Best Sellers:** A list of all products under the "Best Sellers" category, grouped by their main category (e.g., Shoes, Electronics, Bags) and displayed as product cards. Each product's image and title can be clicked to view that product's details page.
- **Product Details:** Displays the product's name, image, price, description, a dropdown to select a variant (if any) and an "Add to Cart" button that allows the user to add the product to their cart. Upon adding an item to the cart, a confirmation message is delivered to the user via a browser alert, and the user must click "OK" to continue. 
- **Search:** Allows the user to search for products based on product name, description, variants (attribute name, attribute value), and categories. If matching product(s) are found, the products' name, price, and image are displayed as product cards. The user can then click on the product image or name to navigate to that product's Product Details page. Otherwise, the user is informed that no matching products were found.
  - Partial matches are accepted, but all search terms must be present in the product's characteristics for a product to be considered a match. For example, "Tu Back" will return "Tumi Backpack" but not "Samsonite Backpack" because the "Tu" search term is missing from the Samsonite Backpack's product name, description, variants (attribute name, attribute value), and categories.
- **Admin:** Links to the following pages:
  - **Shopping Carts List**
    - A list of all active shopping cart IDs, as well as a list of products in each cart. For each product in the cart, you can see the Product Name, Product ID, Product Attribute, Product Attribute ID, Price, and Quantity.
    - If there are no active shopping carts, the page will display a message saying so.
    - NOTE: A new Cart ID is only created when the user first clicks "Add to Cart", and the Cart ID is deleted when the user either clicks "Clear Cart" on the Cart page or "Place order" on the Checkout page.
  - **Orders List**
    - A list of all completed order numbers, with the corresponding customer name and list of products in each order. For each product in an order, you can see the Product Name, Product ID, Product Attribute, Product Attribute ID, Price, and Quantity. 
    - If there are no completed orders yet, the page will display a message saying so.
  - **Manage Products:** More details can be found in the [Extra Feature](#extra-feature) section below.
- **Cart:** Displays a list of products that the user has added to their cart, showing each product's name, image, variant (if any), price, quantity, and product total (price * quantity), as well as the overall cart total. The products are displayed as product cards. From this page, the user can do the following:
  - **Clear Cart:** This clears all items from the user's cart, and deletes their cart ID from the database. Upon deletion, the page displays "Your shopping cart is empty."
  - **Checkout:** This brings the user to the Checkout page, where they will be prompted to enter their Name, review their cart items, and click "Place Order". Once they click "Place Order", they will be brought to the Order Confirmation page, where they will see their name, order number, list of items in their order, and order total. The products are displayed as product cards.

### Extra Feature

The extra feature is the "Manage Products" page which is accessible from the Admin page. From this page, the user can do the following:
  - **Add a Product**
    - This button leads the user to the Add a Product page, wherein they can input the product's name, description, price, and category, upload a photo for the product, and tick a box to indicate that a product is a Best Seller. All fields in this form are required.
  - View a list of all products and their product IDs, and for each product, they can click one of two buttons:
    - **Manage:** This button links to a page with two sections:
      - **Edit Product Details:** The user can view the product's existing details (name, image, description, price, category, and best seller), and change any of them as needed. All fields in this form are required, with the exception of the image upload. If no image is uploaded, the product continues to use its existing image.
      - **Manage Product Attributes:**
        - If the product has existing attributes, the user can view the product's main attribute name (e.g., Size, Storage, Color) alongside its product attribute value(s) (e.g., 128GB) and price for each attribute value. The user may also edit the attribute name or edit any existing attribute value and price.
          - NOTE #1: When editing any of these fields, all of them must be filled (Attribute Name, Attribute Value, Price) before any of them can be saved. The user will be alerted if any of the values are missing, as well as when the new values have been saved successfully.
          - NOTE #2: Clicking "Save" beside the attribute name input will only save the attribute name, but clicking "Save" beside an attribute value and price will save both the attribute name and the attribute value and price. This is because an attribute value and price needs to be associated with an attribute name.
          - NOTE #3: Each product can only have one main attribute name.
        - If the product has existing attributes, the user can also delete any of the existing attributes by clicking the "Delete" button beside the attribute. A confirmation alert will be displayed upon deletion.
          - NOTE: If the product only has one attribute name and price left, clicking "Delete" will also clear the attribute name. This is because an attribute name needs to be associated with an attribute value and price.
        - The user can also add a product attribute value and price by filling the input fields and clicking "Add" button beside these fields.
          - NOTE: To add an attribute value and price, all fields must be filled (Attribute Name, Attribute Value, Price) before it can be successfully added. The user will be alerted if any of the required values are missing. When an attribute value and price is successfully added, the new attribute value and price will be displayed alongside a "Save" and "Delete" button, and the input fields beside the "Add" button will be cleared.
    - **Delete:** This button will trigger an alert that confirms if the user wants to delete the product, and deletes the product from the list of products if the user clicks "OK".

### Getting Started

1. **Clone this repo and switch to the Assignment3 branch.**

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

### Tutorials/Sources Used

- GreatStack: https://www.youtube.com/watch?v=jbfuzcrfjqQ&ab_channel=GreatStack

- Code with Yousaf: https://www.youtube.com/watch?v=DvR-kOl2_SM&ab_channel=CodeWithYousaf

- React with Masoud: https://www.youtube.com/watch?v=Jd7s7egjt30&ab_channel=ReactwithMasoud

- For incrementing order numbers: https://stackoverflow.com/questions/48239888/auto-increment-sequence-in-mongoose

- For implementing file uploads in the Add/Edit Product pages: https://expressjs.com/en/resources/middleware/multer.html

- For randomly pulling 3 products on every Home page refresh: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array