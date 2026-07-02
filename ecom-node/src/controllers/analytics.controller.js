const Product = require('../models/product.model');
const Order = require('../models/order.model');

// GET /api/admin/app/analytics
const getAnalytics = async (req, res) => {
  try {
    const [productCount, totalOrders, revenueResult] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ]);
    const totalRevenue = revenueResult.length ? revenueResult[0].total : 0;
    return res.status(200).json({
      productCount: String(productCount),
      totalOrders: String(totalOrders),
      totalRevenue: String(totalRevenue),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalytics };
