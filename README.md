# Campus Marketplace

A secure student-to-student marketplace platform designed for college campuses where students can buy, sell, rent, and exchange items within a trusted community.

---

## 🚀 Overview

Campus Marketplace is a full-stack web application created to solve the problem of unsafe and unreliable buying/selling platforms for students. Instead of using random public marketplaces, students can trade with verified users from their own college.

The platform focuses on:

* 🔐 Trust-based transactions
* 🎓 College email verification
* 💬 Real-time communication between students
* 📦 Easy product listing and browsing
* ⭐ Ratings and reviews system
* 🛡️ Scam reduction and safer exchanges

---

## ✨ Features

### 👤 Authentication & User Management

* User signup/login
* JWT-based authentication
* Password hashing using bcrypt
* College email verification
* User profiles
* Profile image upload

### 🛒 Marketplace Features

* Create product listings
* Upload product images
* Edit/delete listings
* Browse products by category
* Search functionality
* Product filtering and sorting
* Product condition selection

### 💬 Communication

* In-app chat system
* Seller contact system
* Real-time messaging (optional Socket.IO integration)

### ⭐ Trust & Safety

* User ratings and reviews
* Verified student badge
* Report listing feature
* Scam prevention through college-only access

### 📱 Responsive UI

* Mobile-friendly design
* Clean dashboard layout
* Easy navigation

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* JWT Authentication
* Multer (for image uploads)

### Database

* MongoDB
* Mongoose

### Optional Enhancements

* Socket.IO for live chat
* Cloudinary for image storage
* Razorpay/Stripe for payments
* Redis for caching

---

## 📂 Project Structure

```bash
campus-marketplace/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/campus-marketplace.git
cd campus-marketplace
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend server:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables

| Variable           | Description               |
| ------------------ | ------------------------- |
| PORT               | Backend server port       |
| MONGO_URI          | MongoDB connection string |
| JWT_SECRET         | Secret key for JWT        |
| CLOUDINARY_NAME    | Cloudinary cloud name     |
| CLOUDINARY_API_KEY | Cloudinary API key        |
| CLOUDINARY_SECRET  | Cloudinary secret         |

---

## 📸 Screens / Modules

### Planned Pages

* Home Page
* Login/Register Page
* Marketplace Feed
* Product Details Page
* Add Product Page
* User Dashboard
* Chat Section
* Wishlist Page
* Admin Panel (optional)

---

## 🔄 Workflow

1. User signs up using college email
2. User verifies account
3. User creates product listing
4. Other students browse/search products
5. Interested buyer contacts seller
6. Product gets sold/exchanged
7. Users leave ratings and reviews

---

## 🧠 Future Improvements

* AI-based scam detection
* Recommendation system
* QR-based product pickup verification
* Payment gateway integration
* Delivery/meetup scheduling
* Notifications system
* Dark mode
* Progressive Web App (PWA)

---

## 🧪 Sample API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

### Products

```http
GET /api/products
POST /api/products
GET /api/products/:id
PUT /api/products/:id
DELETE /api/products/:id
```

### Chat

```http
GET /api/chat
POST /api/chat/message
```

---

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Added new feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Create a Pull Request

---

## 🐛 Common Issues

### MongoDB Connection Error

* Check your MongoDB URI
* Ensure MongoDB service is running

### CORS Error

* Make sure frontend URL is allowed in backend CORS settings

### Images Not Uploading

* Verify multer/cloudinary configuration

---

## 📚 Learning Resources

### React

* [https://react.dev/](https://react.dev/)

### Node.js

* [https://nodejs.org/](https://nodejs.org/)

### Express

* [https://expressjs.com/](https://expressjs.com/)

### MongoDB

* [https://www.mongodb.com/docs/](https://www.mongodb.com/docs/)

### Tailwind CSS

* [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 👨‍💻 Team Roles (For 2 Developers)

### Developer 1 – Frontend

* UI/UX Design
* React Components
* Routing
* State Management
* Responsive Design

### Developer 2 – Backend

* API Development
* Database Design
* Authentication
* File Uploads
* Security & Validation

### Shared Tasks

* Testing
* Deployment
* GitHub Management
* Feature Planning

---

## 🚀 Deployment

### Frontend Deployment

* Vercel
* Netlify

### Backend Deployment

* Render
* Railway
* Cyclic

### Database Hosting

* MongoDB Atlas

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Inspiration

This project was built to create a safer and more reliable ecosystem for students to trade products within their campus community.

---

## 🌟 Show Your Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork the project
* 🛠️ Contribute to development

---

## 📬 Contact

For suggestions or collaboration:

* GitHub: `TusharSharma2006`
* Email: `tustustefg@gmail.com`

---

# Made with ❤️ for students
