import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import { bookModel } from "./bookModel";
import { AuthRequest } from "../middlewares/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  console.log("files", req.files);

  // this is how you deal with types for Express Multer
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

  const fileName = files.coverImage[0].filename;

  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );
  try {
    const coverImageuploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;

    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "books-pdf",
        format: "pdf",
      }
    );
    const _req = req as AuthRequest;

    try {
      const newBook = await bookModel.create({
        title,
        genre,
        author: _req.userId,
        coverImage: coverImageuploadResult.secure_url,
        file: bookFileUploadResult.secure_url,
      });

      // deleting the temoprary file from public using fs module
      await fs.promises.unlink(filePath);
      await fs.promises.unlink(bookFilePath);
      res.status(201).json({
        message: "uploaded successfully and the book is created in database",
        coverImageuploadResult,
        bookFileUploadResult,
        _id: newBook._id,
      });
    } catch (err) {
      res.json({ message: "failed to create the book", error: err });
    }
  } catch (err) {
    // Pass the error to the global error handler
    next(err instanceof Error ? err : createHttpError(500, "Server error"));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  try {
    const bookExist = await bookModel.findOne({ _id: bookId });

    if (!bookExist) {
      return next(createHttpError(404).json({ message: "Book not found" }));
    }
    // checking access
    const _req = req as AuthRequest;
    if (bookExist.author.toString() !== _req.userId) {
      return next(createHttpError(403, "Unauthorized"));
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";
    if (files.coverImage) {
      const fileName = files.coverImage[0].filename;
      const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + fileName
      );
      completeCoverImage = fileName;

      const updatedResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: coverImageMimeType,
      });

      completeCoverImage = updatedResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    let completeFileName = "";
    if (files.file) {
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + files.file[0].filename
      );

      const bookFileName = files.file[0].filename;
      completeFileName = bookFileName;

      const updatedResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "book-pdf",
        format: "pdf",
      });

      completeFileName = updatedResultPdf.secure_url;

      await fs.promises.unlink(bookFilePath);
    }

    const updatingBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title,
        genre,
        coverImage: completeCoverImage
          ? completeCoverImage
          : bookExist.coverImage,
        file: completeFileName ? completeFileName : bookExist.file,
      },
      { new: true }
    );
    res.status(200).json(updatingBook);
  } catch (err) {
    // Pass the error to the global error handler
    next(err instanceof Error ? err : createHttpError(500, "Server error"));
  }
};

const getAllbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getAllBooks = await bookModel.find();
    res.json(getAllBooks);
  } catch (err) {
    // Pass the error to the global error handler
    next(err instanceof Error ? err : createHttpError(500, "Server error"));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const getBook = await bookModel.findById({
      _id: req.params.bookId,
    });
    if (!getBook) {
      return next(createHttpError(404, "Book Not Found"));
    }
    res.json(getBook);
  } catch (err) {
    // Pass the error to the global error handler
    next(err instanceof Error ? err : createHttpError(500, "Server error"));
  }
};

export { createBook, updateBook, getAllbook, getSingleBook };
