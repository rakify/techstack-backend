import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FolderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  parentName: {
    type: String,
    default: "",
  },
  parentId: {
    type: String,
    default: "",
  },
  childs: {
    type: Array,
    default: [],
  },
});
const FolderModel = mongoose.model("folders", FolderSchema);
export default FolderModel;
