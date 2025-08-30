# Brgy-Digital-ID System

A modern React-based digital identification system for Barangay Delpilar, streamlining resident identification and barangay services through a secure web platform.

## 🚀 Features

### For Residents
- **Digital ID Generation**: Secure digital identification cards with QR codes
- **Profile Management**: Complete resident information management
- **Service Requests**: Apply for barangay clearances, health certificates, and permits
- **Document Storage**: Secure document upload and management
- **Real-time Status**: Track application and verification status

### For Administrators  
- **Resident Management**: View and manage all resident registrations
- **ID Verification**: Approve/reject digital ID verification requests
- **Service Processing**: Handle service requests and applications
- **System Dashboard**: Overview of system statistics and activities
- **Document Review**: Review uploaded documents and requirements

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0 with Vite
- **Styling**: Tailwind CSS 4.1.7
- **Backend**: Appwrite Cloud (BaaS)
- **Routing**: React Router DOM 7.6.1
- **Icons**: React Icons 5.5.0
- **Authentication**: Appwrite Auth with session management

## 📁 Project Structure

```
src/
├── api/appwrite/           # Backend integration
├── components/             # Reusable components  
├── contexts/               # React contexts (Auth)
├── layouts/                # Layout components
├── pages/                  # Page components
│   ├── admin/              # Admin pages
│   ├── auth/               # Authentication pages
│   ├── shared/             # Shared pages
│   └── user/               # User pages
├── utils/                  # Utility functions
└── config/                 # Configuration files
```

## 🔐 Security Features

- **Session Management**: Automatic logout after 30 minutes of inactivity
- **Route Protection**: Role-based access control for users and admins
- **Data Encryption**: Secure data transmission and storage
- **Cross-tab Sync**: Session synchronization across browser tabs
- **Activity Tracking**: Monitor user activity for security

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Appwrite account and project setup

### Installation

1. Clone the repository
```bash
git clone https://github.com/yatouw/Brgy-Digital-ID.git
cd Brgy-Digital-ID
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Appwrite configuration
# Get these values from your Appwrite console at https://cloud.appwrite.io/
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## 📊 Database Schema

### Collections (Appwrite)
- **residents**: Basic resident information
- **user_info**: Extended user profile data  
- **digital_ids**: Digital ID records and verification status
- **services**: Service requests and applications
- **admins**: Administrator accounts

## 🌐 Routes

### Public Routes
- `/` - Landing page
- `/auth/login` - User login
- `/auth/register` - User registration
- `/admin/login` - Admin login

### Protected User Routes
- `/user/dashboard` - User dashboard
- `/user/profile` - Profile management
- `/user/digital-id` - Digital ID management
- `/user/services` - Service requests

### Admin Routes  
- `/admin/dashboard` - Admin dashboard
- `/admin/residents` - Resident management
- `/admin/digital-ids` - ID verification
- `/admin/services` - Service management

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory and configure your Appwrite settings:

```bash
# Copy the example file
cp .env.example .env
```

Add your Appwrite configuration to `.env`:

```bash
VITE_APPWRITE_ENDPOINT=https://your-appwrite-endpoint/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
```

### Appwrite Setup

1. Create an account at [Appwrite Cloud](https://cloud.appwrite.io/)
2. Create a new project
3. Set up the following collections in your database:
   - `residents` - Basic resident information
   - `user_info` - Extended user profile data
   - `digital_ids` - Digital ID records and verification status
   - `services` - Service requests and applications
   - `admins` - Administrator accounts

4. Configure storage buckets:
   - `profile_photos` - User profile images
   - `documents` - Document uploads
   - `id_photos` - ID-related photos

5. Update your `.env` file with the project details from your Appwrite console

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

Project Link: [https://github.com/yatouw/Brgy-Digital-ID](https://github.com/yatouw/Brgy-Digital-ID)

---
**Barangay Delpilar Digital ID System** - Modernizing local government services through technology.
