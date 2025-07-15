import mongoose from "mongoose";
interface ITicket {
  title: string;
  description: string;
  status: string;
  createdBy: string;
  AssignedTo: string;
  priority: string;
  deadline: Date;
  relatedSkills: string[];
  comment: string;
}
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    AssignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    deadline: {
      type: Date,
      required: true,
    },
    relatedSkills: [String],
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model<ITicket>("Ticket", ticketSchema);
