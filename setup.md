
---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 16+ & npm/yarn
- **Docker** & Docker Compose
- **Python** 3.8+ (for AI services)
- **PlatformIO** (for firmware development)
- **Git**

### Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/harshit123-beep/smart-kitchen-iot.git
   cd smart-kitchen-iot
   docker-compose up -d
   This starts:

PostgreSQL Database
MQTT Broker (Mosquitto)
Backend API Server
AI Service
Redis Cache
# Backend
cd backend/api-server
npm install
npm run dev

# Mobile App
cd mobile-app/react-native
npm install
npm run android  # or ios

# Website# Backend
cd backend/api-server
npm install
npm run dev

# Mobile App
cd mobile-app/react-native
npm install
npm run android  # or ios

# Website
cd website
npm install
npm run dev
cp .env.example .env
# Edit .env with your configurations
cd website
npm install
npm run dev
