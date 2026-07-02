const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Cart = require('../models/cart.model');
const { paginate, buildPageResponse } = require('../utils/pagination.utils');
const { upload, constructImageUrl } = require('../utils/file.utils');

const formatProduct = (p) => ({
  productId: p._id,
  productName: p.productName,
  image: constructImageUrl(p.image),
  description: p.description,
  quantity: p.quantity,
  price: p.price,
  discount: p.discount,
  specialPrice: p.specialPrice,
});

// POST /api/admin/categories/:categoryId/product
const addProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found', status: false });

    const existing = await Product.findOne({ productName: req.body.productName, category: category._id });
    if (existing) return res.status(400).json({ message: 'Product already existing', status: false });

    const product = new Product({
      ...req.body,
      category: category._id,
      user: req.user ? req.user._id : undefined,
    });
    await product.save();
    return res.status(201).json(formatProduct(product));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/public/products
const getAllProducts = async (req, res) => {
  try {
    const { pageNumber = 0, pageSize = 50, SortBy = '_id', sortOrder = 'asc' } = req.query;
    const { skip, limit, sort } = paginate(pageNumber, pageSize, SortBy, sortOrder);
    const [products, total] = await Promise.all([
      Product.find().sort(sort).skip(skip).limit(limit).populate('category'),
      Product.countDocuments(),
    ]);
    if (!products.length) return res.status(400).json({ message: 'Product not present', status: false });
    return res.status(200).json(buildPageResponse(products.map(formatProduct), total, pageNumber, pageSize));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/public/categories/:categoryId/products
const getProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found', status: false });
    const { pageNumber = 0, pageSize = 50, SortBy = 'price', sortOrder = 'asc' } = req.query;
    const { skip, limit, sort } = paginate(pageNumber, pageSize, SortBy, sortOrder);
    const [products, total] = await Promise.all([
      Product.find({ category: category._id }).sort(sort).skip(skip).limit(limit),
      Product.countDocuments({ category: category._id }),
    ]);
    if (!products.length) return res.status(400).json({ message: `${category.categoryName} - Product not found`, status: false });
    return res.status(200).json(buildPageResponse(products.map(formatProduct), total, pageNumber, pageSize));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/public/products/keyword/:Keyword
const getProductsByKeyword = async (req, res) => {
  try {
    const keyword = req.params.Keyword;
    const { pageNumber = 0, pageSize = 50, SortBy = '_id', sortOrder = 'asc' } = req.query;
    const { skip, limit, sort } = paginate(pageNumber, pageSize, SortBy, sortOrder);
    const query = { productName: { $regex: keyword, $options: 'i' } };
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);
    if (!products.length) return res.status(400).json({ message: `Product not found with keyword: ${keyword}`, status: false });
    return res.status(200).json(buildPageResponse(products.map(formatProduct), total, pageNumber, pageSize));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/products/:productId
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found', status: false });

    Object.assign(product, req.body);
    product.specialPrice = product.price - (product.discount * 0.01 * product.price);
    await product.save();

    // Update product price in all carts that contain it
    await Cart.updateMany(
      { 'cartItems.product': product._id },
      { $set: { 'cartItems.$[elem].productPrice': product.specialPrice, 'cartItems.$[elem].discount': product.discount } },
      { arrayFilters: [{ 'elem.product': product._id }] }
    );

    return res.status(200).json(formatProduct(product));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/admin/products/:productId
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found', status: false });

    // Remove from all carts
    await Cart.updateMany(
      { 'cartItems.product': product._id },
      { $pull: { cartItems: { product: product._id } } }
    );
    await product.deleteOne();
    return res.status(200).json(formatProduct(product));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/admin/products/:productId/image
const updateProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found', status: false });
    if (!req.file) return res.status(400).json({ message: 'No image file provided', status: false });

    product.image = req.file.filename;
    await product.save();
    return res.status(200).json(formatProduct(product));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/products
const getAllProductsForAdmin = async (req, res) => {
  try {
    const { pageNumber = 0, pageSize = 50, sortBy = '_id', sortOrder = 'asc' } = req.query;
    const { skip, limit, sort } = paginate(pageNumber, pageSize, sortBy, sortOrder);
    const [products, total] = await Promise.all([
      Product.find().sort(sort).skip(skip).limit(limit).populate('category user'),
      Product.countDocuments(),
    ]);
    return res.status(200).json(buildPageResponse(products.map(formatProduct), total, pageNumber, pageSize));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/seller/products
const getAllProductsForSeller = async (req, res) => {
  try {
    const { pageNumber = 0, pageSize = 50, sortBy = '_id', sortOrder = 'asc' } = req.query;
    const { skip, limit, sort } = paginate(pageNumber, pageSize, sortBy, sortOrder);
    const query = { user: req.user._id };
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);
    return res.status(200).json(buildPageResponse(products.map(formatProduct), total, pageNumber, pageSize));
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addProduct, getAllProducts, getProductsByCategory, getProductsByKeyword,
  updateProduct, deleteProduct, updateProductImage, getAllProductsForAdmin, getAllProductsForSeller,
};
