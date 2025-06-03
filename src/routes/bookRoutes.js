import express from "express";
import Book from "../models/Book.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

router.get("/", protectRoute),
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 5;
      const skip = (page - 1) * limit;

      const books = await Book.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username,profileImage");

      const totalBook = await Book.countDocuments();
      res.send({
        books,
        currentPage: page,
        totalBook,
        totalPages: Math.ceil(totalBook / limit),
      });
    } catch (error) {}
  };

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    //check is user is the creator of the book
    if (book.user.toString() != req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error in deleting image from cloudinary");
      }
    }

    await book.deleteOne();

    res.json({ message: "Book Deleted Successfully" });
  } catch (error) {}
});

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;
    if (!title || !caption || !image || !rating)
      return res.status(400).json({ message: "All fields are required" });

    // upload image to cloudinary
    const uploadRes = await cloudinary.uploader.upload(image);
    const imageUrl = uploadRes.secure_url;

    const newBook = new Book({
      title,
      caption,
      image,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    await newBook.save();
  } catch (error) {}
});

router.get("/user", protectRoute, async (req, res) => {
  try {
    // upload image to cloudinary
    const books = await Book.find({ user: req.user._d }).sort({
      createdAt: -1,
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
