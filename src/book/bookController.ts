import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  // const {}=req.body;
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

    res.status(201).json({
      message: "uploaded successfully",
      coverImageuploadResult,
      bookFileUploadResult,
    });
  } catch (err) {
    // Log the error for debugging
    console.error("Error in createBook:", err);

    // Pass the error to the global error handler
    next(err instanceof Error ? err : createHttpError(500, "Server error"));
  }
};

export { createBook };
