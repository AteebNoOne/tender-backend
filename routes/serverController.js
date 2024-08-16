import mongoose from 'mongoose';
import os from 'os';

export const ServerAndDatabaseHealth = async (req, res, next) => {
  try {
    // Check MongoDB connection status
    const mongoConnectionStatus = mongoose.connection.readyState === 1 ? "Connected" : "Not Connected";

    // Gather server stats
    const serverStats = {
      uptime: process.uptime(), // Server uptime in seconds
      memoryUsage: process.memoryUsage(), // Memory usage in bytes
      cpuUsage: process.cpuUsage(), // CPU usage
      loadAverage: os.loadavg(), // Load average (1, 5, and 15 minutes)
      mongoConnection: mongoConnectionStatus, // MongoDB connection status
    };

    // Send the complete stats along with success true
    res.status(200).json({
      success: true,
      serverStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
