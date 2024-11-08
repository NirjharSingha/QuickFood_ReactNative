<h1>QuickFood (A Food Delivery App With React Native)</h1> 
<br />
<h3>Links:</h3> <br />

The download link for the android apk of the app is given below. The backend is hosted on Render and the database is hosted on Aiven.

<br/>

<b> Download Android APK: </b>

```
https://expo.dev/accounts/user_ns/projects/QuickFood/builds/9d951010-3646-4ba8-88bf-11f260dd4074
```

<br/>

<b> Sample Users: </b>
<br/>
These are some sample user accounts using which you can login to the app and see the features.
<br/>

| Serial No | ID                          | Role                          | Password |
|-----------|-----------------------------|-------------------------------|----------|
| 1         | webprojecttest63@gmail.com  | User(mainly customer)         | pass     |
| 2         | user1@gmail.com             | User(mainly restaurant_owner) | pass     |
| 3         | rider_1                     | Rider                         | pass     |
| 4         | ADMIN                       | Admin                         | pass     |

<br/>

<b> Youtube demonstration link: </b>
<br/>
<p> A youtube demonstration link of the app is also given below. You can see the demonstration and know the features of the app: </p>
<br/>

<p align="center">
  <a href="https://youtu.be/CQKs_RtvfpY?si=Btow64LsTLCOsQmS">
    <img src="./README/youtube_logo.png" alt="QuickFood" width="300" height="200">
  </a>
</p>
<br/>
<br/>
<hr/>
<br/>
The QuickFood app aims to revolutionize the takeout experience by providing a seamless platform for ordering from local restaurants and ensuring timely delivery. It offers a user-friendly interface for easy navigation and order placement, along with a robust review system for user feedback. Restaurant owners benefit from analytical tools to track sales, customer reviews, and repeat rates, enabling data-driven improvements. This approach fosters a symbiotic ecosystem where users enjoy convenience and variety, while local restaurants thrive by adapting to customer preferences.
<br /> <br />

<h3> User Profiles: </h3>

QuickFood web application caters to several distinct user classes, each with unique roles,
needs, and privileges:

<h4> 1. Food Delivery Riders: </h4>

**Characteristics:** Food delivery riders are individuals responsible for transporting orders from restaurants to customers' locations. They typically possess strong navigational skills and the ability to work efficiently in fast-paced environments.

**Functionality:** Riders utilize the QuickFood app to receive order assignments and view delivery instruction. They will also provide updates on order status and communicate with customers as needed.

<h4> 2. Restaurant Owners: </h4>

**Characteristics:** Restaurant managers oversee the operations of their
respective establishments, including menu management and order
processing. They require access to administrative functionalities to
efficiently manage their restaurant's presence on the QuickFood platform.

**Functionality:** Restaurant managers utilize the QuickFood admin dashboard to update menu items, manage order queues, and monitor performance metrics. They may also interact with customer feedback and reviews to maintain quality standards and enhance customer satisfaction.

<h4> 3. Customers: </h4>

**Characteristics:** Customers are individuals who use the QuickFood app to browse restaurants, place food orders, and track delivery status. They may vary in preferences, dietary requirements, and ordering habits.

**Functionality:** Customers access the QuickFood platform to explore restaurant listings, browse menus, place orders, and make payments securely. They can track the status of their orders in real-time and provide feedback on their dining experiences.

<h4> 4. Admin: </h4>

**Characteristics:** The admin user class possesses elevated privileges and responsibilities for overseeing the overall operation and management of the QuickFood platform. Admins ensure smooth functioning, enforce policies, and handle escalated issues.

**Functionality:** Admins have access to comprehensive administrative tools within the QuickFood platform to manage user accounts, resolve disputes, enforce policies, and perform system maintenance tasks. They play a crucial role in ensuring platform integrity, security, and adherence to regulatory standards.

<h3>Feature Details:</h3> <br />

**User Authentication:** Authentication is required for users to access restricted features and make transactions on the food delivery web app securely. Users can authenticate themselves through email/password whereas employees can do so using employee ID and password. The authentication process verifies the user's identity and grants access to authorized functionalities based on their role.

**User Account Management:** QuickFood will offer comprehensive user registration, login, and profile management features, enabling users to create and maintain personalized accounts. Users can update personal information, view order history, and save favorite restaurants for future orders.

**Restaurant and Food Discovery:** QuickFood will empower users to explore a diverse range of restaurants and culinary offerings through intuitive browsing and robust search functionalities. Users can discover nearby eateries, explore menus, and filter options based on cuisine, price range, and dietary preferences.

**Advanced Search and Filter Options:** QuickFood will provide users with powerful search and filter functionalities to enhance their dining experience. Users can effortlessly search for restaurants by name using the search bar and apply various filters to narrow down their choices. These filters will include menu items, price range, category (e.g.,Non-vegetarian, Vegetarian, Vegan, Drink), and customer ratings, allowing users to find the perfect dining option that meets their preferences and needs.

**Restaurant & Menu Management Tools:** QuickFood will equip restaurant partners with dedicated management tools to streamline menu updates and order processing. Restaurants can efficiently manage incoming orders, update menu offerings, and track performance metrics to optimize operations.

**Order Management:** Users will have the ability to effortlessly place, customize, and cancel food orders according to their preferences. QuickFood will streamline the ordering process, allowing users to specify delivery instructions, select preferred delivery times, and manage multiple orders simultaneously.

**Rating and Review System:** QuickFood will implement a robust rating and review system, allowing users to provide feedback on their food delivery experiences. Users can rate restaurants, delivery services, and individual food items, helping to foster transparency and accountability within the platform.

**Real-Time Notifications and Chat:** QuickFood will keep users informed and connected with real-time notifications and chat features. Users will receive instant updates about their order progress, while riders and restaurant owners will be notified promptly about new orders. Additionally, a dedicated chat room will be established between customers and riders, enabling seamless communication regarding delivery details, special instructions, and any other queries, ensuring a smooth and efficient order fulfillment process.

**Sale & Performance Analysis:** QuickFood will empower administrators and restaurant owners with comprehensive sale and performance analysis tools. Through intuitive charts and visualizations, such as bar charts, doughnut charts, line charts, and pie charts, they can monitor the sales rates and ratings of individual food items. Administrators can also analyze the performance of different restaurants and riders, gaining valuable insights to make data-driven decisions. This feature ensures that all stakeholders have a clear understanding of their performance metrics, helping to identify areas for improvement and optimize overall operations.

<br /> <br />
<h3>Integrations of Advanced Functionalities:</h3> <br />
<b>Real-time Communication with Web-Sockets:</b><br />Implements real-time notification & chat feature using web-socket. This feature enables customers and riders to engage in instant messaging within the platform along with real-time delivery status via notifications. Web-Socket facilitates bidirectional communication between the client and server, allowing messages to be sent and received in real-time allowing increased user experience through seamless communication.
<br /> <br />
<b>Infinite Scrolling in Restaurant, Menu and Chat Pages:</b><br />Implements infinite scrolling functionality on various pages of the platform, including restaurant list, menu list and chat conversations. Instead of traditional pagination, where users navigate through pages of content, infinite scrolling dynamically loads additional content as the user scrolls down the page, providing a seamless and uninterrupted browsing experience.
<br /> <br />
<h3>Tech-Stack Used in the Project:</h3> <br />
<b>Front-End Technology:</b>
<br />

- React Native
- NativeWind (A library for using Tailwind CSS in React Native)
- Lottie Animations
- React Native Paper (UI Library)

<br />
<b>Back-End Technology:</b>
<br />

- Spring Boot
- Socket (implementing real time notification & chat feature)

<br />
<b>Database:</b>
<br />

- MySQL

<br />


<br />
<h2>Local Development:</h2> <br />

First clone the git repository using the following command.

```bash
git clone https://github.com/NirjharSingha/QuickFood_ReactNative.git
```

<h3>Build Frontend:</h3> <br />

<b>Environment variables that need to update:</b>

| Variable Name                   | Value                                                                      |
|---------------------------------|----------------------------------------------------------------------------|
| EXPO_PUBLIC_SERVER_URL          | URL where spring boot server is running (default port 8080)                |

<br />
Come to the base directory of the project and then create a .env file in the frontend folder (from base directory the path of the file is "./frontend/.env"). Then place the environment variables of the frontend section listed above with required values. Then from base directory, run the following commands in terminal.

```bash
cd frontend
npm install
npx expo start
```

To build the android apk file for the app, go to frontend/eas.json file and update the value of the env variable 'EXPO_PUBLIC_SERVER_URL' in all three places - "development", "preview" and "production".

After updating the environment variable, run the following command in terminal.

```bash
eas build -p android --profile preview
```

This will build the android apk file for the app.

<h3>Build Backend:</h3> <br />

<b>Environment variables that need to update:</b>

<b>Spring Boot Server:</b>

| Variable Name                   | Value                                                                      |
|---------------------------------|----------------------------------------------------------------------------|
| SPRING_DATASOURCE_URL           | jdbc:mysql://localhost:3306/{Your_Database_Name}                           |
| SPRING_DATASOURCE_USERNAME      | Your database username (You can use "root" user)                           |
| SPRING_DATASOURCE_PASSWORD      | Password of the database user                                              |
| JWT_SECRET                      | Your JWT_Secret_Key                                                        |

<b>DB (This portion is needed only for docker build):</b>

| Variable Name                   | Value                                                                      |
|---------------------------------|----------------------------------------------------------------------------|
| MYSQL_DATABASE                  | Your Database Name (eg "Quick_Food_Database")                              |
| MYSQL_USER(not for docker)      | Your database username (You can use "root" user)                           |
| MYSQL_ROOT_PASSWORD             | Set the required password here                                             |
| MYSQL_PASSWORD(not for docker)  | Set the required password here                                             |

<b>MYSQL_USER and MYSQL_PASSWORD are needed only for local connection without docker. If you use docker build then ignore these two variable and update the rest of the two in compose.yml</b>

<br />

You have the flexibility to build the backend either locally or with Docker. Building locally involves installing necessary tools and executing build commands, while Docker provides a consistent environment with its Dockerfile and image creation process. 
<br /> <br />
<b>Using Docker:</b><br />
At first come to the base directory of the project. Then go to backend folder and set the value of the environment variables listed above in the compose.yml (from base directory the path of the file is "./backend/compose.yml") file. Then run the following command in terminal staying in the directory '/backend'.

```bash
docker compose up -d --build
```

This will build your spring boot server in docker container along with local MySQL instance.

<br /><br />

```bash
docker exec -it $(docker ps -qf "name=backend-db-1") mysql -u root -p<Your Password> -e "CREATE DATABASE IF NOT EXISTS Quick_Food_Database;"
```

Make sure to place your database password in the place of 'Your Password'. This will create a database named 'Quick_Food_Database' in the docker container. Now your server can connect to the database.

To start both images (database & spring boot server), come to the base directory of the project. Then run the following command in terminal.

```bash
cd backend
docker compose start
```

To stop all three images (database & spring boot server), come to the base directory of the project. Then run the following command in terminal.

```bash
docker compose stop
```

<b>Without Docker:</b><br />
At first let's build the MySQL database locally. For this you must have MySQL installed in your local device. Then run the following command in terminal.

```bash
mysql -u root -p -e "CREATE DATABASE Quick_Food_Database;"
```

This will create an empty database with only the entry of the Admin. The id and password of the Admin will be 'ADMIN' and 'pass' respectively. You can further modify this.

<br />
Now let's build the backend server locally. Come to the base directory of the project and then open the backend folder. You can use an IDE <b>(INTELLIJ IDEA Recommended)</b> to run the spring boot server of your application. But you must have the <b>Lombok Plugin</b> installed in your <b>INTELLIJ IDEA</b> to run the spring boot server.

To set the environment variables for server open the application.yml (from base directory the path of the file is "./backend/src/main/resources/application.yml") file and replace the environment variables of server section listed above with their corresponding values.

This will start your spring boot backend server.<br/>
Your backend server will be running on port 8080.

<br /><br />

<h3>Some images of the project:</h3> <br />

<p align="center">
  <img src="./README/img1.png" alt="Image 1" width="45%">
  <img src="./README/img2.png" alt="Image 2" width="45%">
</p>

<p align="center">
  <img src="./README/img3.png" alt="Image 3" width="45%">
  <img src="./README/img4.png" alt="Image 4" width="45%">
</p>

<p align="center">
  <img src="./README/img5.png" alt="Image 5" width="45%">
  <img src="./README/img6.png" alt="Image 6" width="45%">
</p>

<p align="center">
  <img src="./README/img7.png" alt="Image 7" width="45%">
  <img src="./README/img8.png" alt="Image 8" width="45%">
</p>

<p align="center">
  <img src="./README/img9.png" alt="Image 9" width="45%">
  <img src="./README/img10.png" alt="Image 10" width="45%">
</p>

<p align="center">
  <img src="./README/img11.png" alt="Image 11" width="45%">
  <img src="./README/img12.png" alt="Image 12" width="45%">
</p>

<p align="center">
  <img src="./README/img13.png" alt="Image 13" width="45%">
  <img src="./README/img14.png" alt="Image 14" width="45%">
</p>

<p align="center">
  <img src="./README/img15.png" alt="Image 15" width="45%">
  <img src="./README/img16.png" alt="Image 16" width="45%">
</p>

<p align="center">
  <img src="./README/img17.png" alt="Image 17" width="45%">
  <img src="./README/img18.png" alt="Image 18" width="45%">
</p>

<p align="center">
  <img src="./README/img19.png" alt="Image 19" width="45%">
  <img src="./README/img20.png" alt="Image 20" width="45%">
</p>

<p align="center">
  <img src="./README/img21.png" alt="Image 21" width="45%">
  <img src="./README/img22.png" alt="Image 22" width="45%">
</p>

<p align="center">
  <img src="./README/img23.png" alt="Image 23" width="45%">
  <img src="./README/img24.png" alt="Image 24" width="45%">
</p>

The QuickFood app is poised to revolutionize the food delivery industry by offering a seamless, user-friendly platform that caters to the needs of customers, restaurant owners, and delivery riders alike. With its robust feature set, including real-time order tracking, secure payment processing, and advanced search and filtering options, QuickFood ensures a convenient and satisfying experience for users. Restaurant owners benefit from powerful management tools and performance analytics, while delivery riders can efficiently manage orders and routes. The integration of advanced functionalities like OAuth 2.0, Email.js for OTP verification, WebSockets for real-time communication, and Google Maps for navigation further enhances the platform's reliability and efficiency. By fostering a symbiotic ecosystem, QuickFood enables local restaurants to thrive and customers to enjoy a wide variety of dining options delivered right to their doorstep.