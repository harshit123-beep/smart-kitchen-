import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const HomeScreen = () => {
  const [devices, setDevices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch devices
      const devicesResponse = await fetch('http://localhost:3000/api/devices');
      const devicesData = await devicesResponse.json();
      setDevices(devicesData.devices || []);

      // Fetch orders
      const ordersResponse = await fetch('http://localhost:3000/api/orders');
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.orders || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const renderDeviceCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: item.is_online ? '#4CAF50' : '#F44336' }]}>
          <Text style={styles.statusText}>{item.is_online ? 'Online' : 'Offline'}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{item.location}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.label}>Status: <Text style={styles.value}>{item.status}</Text></Text>
        <Text style={styles.label}>Temp: <Text style={styles.value}>{item.temperature}°C</Text></Text>
      </View>
    </View>
  );

  const renderOrderCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardSubtitle}>{item.customer_name}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.label}>Items: <Text style={styles.value}>{item.items.join(', ')}</Text></Text>
        <Text style={styles.label}>ETA: <Text style={styles.value}>{item.estimated_time}</Text></Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍳 Smart Kitchen Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time kitchen management</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{devices.length}</Text>
          <Text style={styles.statLabel}>Devices</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>Active Orders</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>Uptime</Text>
        </View>
      </View>

      {/* Devices Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔌 Connected Devices</Text>
        <FlatList
          data={devices}
          renderItem={renderDeviceCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Orders Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Recent Orders</Text>
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Device</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.buttonTextSecondary}>View Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  cardContent: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginVertical: 3,
  },
  value: {
    fontWeight: 'bold',
    color: '#333',
  },
  actionsContainer: {
    padding: 15,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
