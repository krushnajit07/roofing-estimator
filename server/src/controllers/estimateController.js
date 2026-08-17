import crypto from "crypto";

import { Config } from "../models/Config.js";
import { Lead } from "../models/Lead.js";

import { calculateEstimate } from "../services/calculator.js";
import { validateEstimateInput } from "../services/validator.js";

export const createEstimate = async (req, res) => {
  try {
    const { name, phone, email, answers } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and email are required.",
      });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required.",
      });
    }

    const config = await Config.findOne().sort({
      config_version: -1,
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found.",
      });
    }

    const validationErrors = validateEstimateInput(
      config,
      answers
    );

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please correct the submitted answers.",
        errors: validationErrors,
      });
    }

    const estimate = calculateEstimate(
      config,
      answers
    );

    const lead = await Lead.create({
      lead_id: `ld_${crypto.randomBytes(4).toString("hex")}`,
      captured_at: new Date(),
      config_version: config.config_version,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      answers,
      estimate_low: estimate.estimate_low,
      estimate_high: estimate.estimate_high,
    });

    return res.status(201).json({
      success: true,
      data: {
        lead_id: lead.lead_id,
        config_version: lead.config_version,
        estimate_low: lead.estimate_low,
        estimate_high: lead.estimate_high,
      },
    });
  } catch (error) {
    console.error("Error creating estimate:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate estimate.",
    });
  }
};