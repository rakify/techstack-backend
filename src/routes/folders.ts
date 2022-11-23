const router = require("express").Router();
import { Request, Response } from "express";
import Folder from "../models/Folder";

//GET ALL folders
router.get("/", async (req: Request, res: Response) => {
  try {
    const folders = await Folder.find();
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET children folders for specific parent folder
router.get("/find/:id", async (req: Request, res: Response) => {
  try {
    const folder = await Folder.findById(req.params.id);
    console.log(folder!.childs!);
    res.status(200).json(folder!.childs!);
  } catch (err) {
    res.status(404).json(err);
  }
});

//Get a folder
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const folder = await Folder.findById(req.params.id);
    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE A Folder
router.post("/", async (req: Request, res: Response) => {
  const newFolder = new Folder(req.body);
  try {
    const savedFolder = await newFolder.save();
    res.status(201).json({
      message: "New folder added successfully.",
      data: savedFolder,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//DELETE A Folder
router.delete("/delete", async (req: Request, res: Response) => {
  const id = req.body.id;
  const parentId = req.body.parentId;
  try {
    await Folder.findByIdAndDelete(id);
    await Folder.deleteMany({ parentId: id });
    await Folder.updateOne(
      { _id: parentId },
      {
        $pull: {
          childs: { id: id },
        },
      }
    );
    res.status(200).json("The folder has been deleted.");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Add new child to parent
router.put("/:id", async (req: Request, res: Response) => {
  const child = {
    name: req.body.name,
    id: req.body.id,
    parentId: req.params.id,
  };
  try {
    const folder = await Folder.findById(req.params.id);
    folder!.childs.push(child);
    const updatedFolder = await Folder.findByIdAndUpdate(
      req.params.id,
      folder!,
      { new: true }
    );
    res.status(200).json(updatedFolder);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
