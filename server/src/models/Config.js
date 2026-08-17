import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    rate_per_sqft: {
      type: Number,
    },

    multiplier: {
      type: Number,
    },

    tear_off_per_sqft: {
      type: Number,
    },
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["number", "select"],
      required: true,
    },

    unit: {
      type: String,
    },

    required: {
      type: Boolean,
      default: true,
    },

    min: {
      type: Number,
    },

    max: {
      type: Number,
    },

    active: {
      type: Boolean,
      default: true,
    },

    options: {
      type: [OptionSchema],
      default: [],
    },
  },
  { _id: false }
);

const ConfigSchema = new mongoose.Schema(
  {
    config_version: {
      type: Number,
      required: true,
    },

    business: {
      name: {
        type: String,
        required: true,
      },

      region: {
        type: String,
        required: true,
      },

      currency: {
        type: String,
        required: true,
      },
    },

    questions: {
      type: [QuestionSchema],
      required: true,
    },

    modifiers: {
      waste_factor: {
        type: Number,
        required: true,
      },

      permit_flat_fee: {
        type: Number,
        required: true,
      },

      range_spread_pct: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Config = mongoose.model("Config", ConfigSchema);