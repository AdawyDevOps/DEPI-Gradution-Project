# Calorie Chronicle - Calorie Tracking Application


A comprehensive full-stack calorie tracking application built with modern technologies including React, Node.js, MongoDB, and deployed with Kubernetes.

## 🚀 Features

- **🔐 User Authentication** - Secure register and login system with JWT
- **📊 Calorie Tracking** - Add, edit, and manage daily food entries
- **📈 Dashboard Analytics** - Visualize daily calorie statistics and progress
- **👤 Profile Management** - User profile with personal goals and settings
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **🐳 Containerized** - Docker containers for easy deployment
- **☸️ Kubernetes Ready** - Production-grade orchestration

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Deployment & Infrastructure
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **Nginx** - Web server and reverse proxy
- **MongoDB** - Database service

## 📁 Project Structure

```
calorie-chronicle/
├── 📁 backend/                 # Node.js API Server
│   ├── config/                # Database configuration
│   ├── middleware/            # Auth and validation
│   ├── models/                # MongoDB models (User, FoodEntry, Meal)
│   ├── routes/                # API routes (auth, foodEntries, meals, users)
│   └── server.js              # Entry point
├── 📁 frontend/               # React Application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context
│   │   ├── services/         # API services
│   │   └── styles/           # CSS files
│   └── nginx.conf            # Nginx configuration
├── 📁 k8s/                   # Kubernetes Manifests
│   ├── base/                 # Base configurations
│   ├── backend/              # Backend deployment
│   ├── frontend/             # Frontend deployment
│   ├── mongodb/              # Database setup
│   └── ingress/              # Networking
└── 📁 database/              # Database initialization
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Docker & Docker Compose (for container deployment)
- Kubernetes cluster (for production deployment)

### Local Development

#### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/calorieapp" >> .env
echo "JWT_SECRET=your_jwt_secret_here" >> .env
echo "PORT=5000" >> .env

npm start
```

#### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" >> .env

npm run dev
```

### Docker Deployment
```bash
# Using Docker Compose
docker-compose up -d

# Or build individually
docker build -t calorie-backend ./backend
docker build -t calorie-frontend ./frontend
```

### Kubernetes Deployment
```bash
# Deploy entire stack
kubectl apply -k k8s/

# Check status
kubectl get all -n calorie-chronicle

# View logs
kubectl logs -f deployment/calorie-backend -n calorie-chronicle
```

## 📊 API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | User registration | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/food-entries` | Get user's food entries | Required |
| POST | `/api/food-entries` | Add new food entry | Required |
| PUT | `/api/food-entries/:id` | Update food entry | Required |
| DELETE | `/api/food-entries/:id` | Delete food entry | Required |
| GET | `/api/meals` | Get user's meals | Required |
| GET | `/api/profile` | Get user profile | Required |
| PUT | `/api/profile` | Update user profile | Required |

## ⚙️ Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://mongodb:27017/calorieapp
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🐳 Docker & Kubernetes

### Docker Images
```dockerfile
# Backend Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Kubernetes Services
- **Namespace**: `calorie-chronicle`
- **MongoDB**: Stateful service with persistent storage
- **Backend**: Node.js API with health checks
- **Frontend**: React app served by Nginx
- **Ingress**: Route traffic with path-based routing

## 🚀 Deployment

### Production Deployment with Kubernetes
```bash
# Build and push images
docker build -t your-registry/calorie-backend:latest ./backend
docker build -t your-registry/calorie-frontend:latest ./frontend
docker push your-registry/calorie-backend:latest
docker push your-registry/calorie-frontend:latest

# Deploy to Kubernetes
kubectl apply -k k8s/

# Access the application
kubectl get ingress -n calorie-chronicle
```

## 📸 Screenshots

*(Add your application screenshots here)*

- **Dashboard**: View daily calorie intake and goals
- **Food Entry**: Add and manage food consumption
- **Profile**: User settings and goal management

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ahmed Hamaly**
- GitHub: [@hamaly008](https://github.com/hamaly008)
- Email: ahmedhaamaly008@gmail.com

## 🙏 Acknowledgments

- React community for excellent documentation
- MongoDB for robust database solutions
- Kubernetes for powerful container orchestration
- Vite team for fast build tools

---

**Built with ❤️ using React, Node.js, MongoDB, and Kubernetes**

⭐ Star this repo if you found it helpful!

---



---

*For questions and support, please open an issue or contact the author.*
