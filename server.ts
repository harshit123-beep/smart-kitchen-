import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mqtt from 'mqtt';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============= Middleware =============
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============= MQTT Configuration =============
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const mqttClient = mqtt.connect(MQTT_BROKER, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 5000,
});

mqttClient.on('connect', () => {
  console.log('✅ Connected to MQTT Broker');
  mqttClient.subscribe('kitchen/+/device/+/telemetry');
  mqttClient.subscribe('kitchen/+/device/+/status');
});

mqttClient.on('message', (topic: string, message: Buffer) => {
  try {
    const data = JSON.parse(message.toString());
    console.log(`📊 MQTT Message - Topic: ${topic}`);
    console.log('Payload:', data);
    // Store in database or cache
  } catch (error) {
    console.error('Error parsing MQTT message:', error);
  }
});

mqttClient.on('error', (error) => {
  console.error('❌ MQTT Error:', error);
});

// ============= Routes =============

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mqtt_connected: mqttClient.connected,
  });
});

// ============= Authentication Routes =============
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // TODO: Hash password and store in database
    res.status(201).json({
      message: 'User registered successfully',
      user: { email, name, role: role || 'user' }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // TODO: Validate credentials and generate JWT token
    res.json({
      message: 'Login successful',
      token: 'jwt-token-here',
      user: { email, role: 'user' }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= Device Routes =============
app.get('/api/devices', (req: Request, res: Response) => {
  // TODO: Fetch devices from database
  res.json({
    devices: [
      {
        id: 'SKD-001',
        name: 'Smart Cooker - Kitchen A',
        type: 'COOKER',
        location: 'Kitchen A',
        is_online: true,
        status: 'ON',
        temperature: 85,
        last_updated: new Date().toISOString()
      },
      {
        id: 'SKD-002',
        name: 'Refrigerator Monitor - Storage',
        type: 'FRIDGE',
        location: 'Storage Room',
        is_online: true,
        status: 'OK',
        temperature: 4,
        last_updated: new Date().toISOString()
      }
    ]
  });
});

app.post('/api/devices/:id/control', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, value } = req.body;

  try {
    // Publish MQTT message to device
    const topic = `kitchen/device/${id}/control`;
    const message = JSON.stringify({ action, value, timestamp: Date.now() });
    
    mqttClient.publish(topic, message, { qos: 1 }, (error) => {
      if (error) {
        console.error('MQTT publish error:', error);
        return res.status(500).json({ error: 'Failed to control device' });
      }
      
      res.json({
        success: true,
        message: 'Device control command sent',
        device_id: id,
        action,
        value
      });
    });
  } catch (error) {
    console.error('Control error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= Order Routes =============
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const { items, customer_name, delivery_address } = req.body;

    // TODO: Validate and store order in database
    const order = {
      id: `ORD-${Date.now()}`,
      items,
      customer_name,
      delivery_address,
      status: 'pending',
      created_at: new Date().toISOString(),
      estimated_time: '30 minutes'
    };

    // Publish to MQTT for kitchen display
    mqttClient.publish('kitchen/orders/new', JSON.stringify(order), { qos: 1 });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders', (req: Request, res: Response) => {
  // TODO: Fetch orders from database
  res.json({
    orders: [
      {
        id: 'ORD-1234',
        status: 'preparing',
        items: ['Biryani', 'Naan', 'Raita'],
        customer_name: 'John Doe',
        created_at: new Date().toISOString(),
        estimated_time: '15 minutes'
      }
    ]
  });
});

// ============= Inventory Routes =============
app.get('/api/inventory', (req: Request, res: Response) => {
  // TODO: Fetch inventory from database
  res.json({
    inventory: [
      { id: 1, name: 'Flour', quantity: 50, unit: 'kg', status: 'ok' },
      { id: 2, name: 'Sugar', quantity: 5, unit: 'kg', status: 'low' },
      { id: 3, name: 'Oil', quantity: 20, unit: 'liters', status: 'ok' }
    ]
  });
});

app.post('/api/inventory/forecast', async (req: Request, res: Response) => {
  try {
    // Call AI service for demand forecasting
    const forecast = {
      prediction: 'High demand expected in next 24 hours',
      confidence: 0.85,
      recommended_items: ['Flour', 'Tomato', 'Onion'],
      estimated_quantities: [100, 50, 30]
    };

    res.json(forecast);
  } catch (error) {
    console.error('Forecast error:', error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

// ============= Analytics Routes =============
app.get('/api/analytics/dashboard', (req: Request, res: Response) => {
  res.json({
    dashboard: {
      total_orders: 145,
      total_revenue: 25000,
      average_order_value: 172,
      top_items: ['Biryani', 'Naan', 'Raita'],
      device_uptime: '99.8%',
      average_prep_time: '22 minutes'
    }
  });
});

// ============= Error Handling Middleware =============
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============= 404 Handler =============
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============= Start Server =============
app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════╗
    ║   🍳 Smart Kitchen IoT Backend API        ║
    ║   Running on port ${PORT}                ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}         ║
    ╚═══════════════════════════════════════════╝
  `);
});

export default app;
