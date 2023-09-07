// Create schema
let JobSchema = mongoose.Schema({
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: false,
      default: "anonymous",
    },
    createdAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      required: false,
      default: Date.now,
    },
  });
  
  // Create Model
  let Job = mongoose.model("Job", JobSchema);