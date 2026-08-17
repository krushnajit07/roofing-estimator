import { Config } from "../models/Config.js";
import { Lead } from "../models/Lead.js";

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ captured_at: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads.",
    });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const {
      business,
      questions,
      modifiers,
    } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message: "Questions must be an array.",
      });
    }

    const currentConfig =
      await Config.findOne().sort({
        config_version: -1,
      });

    if (!currentConfig) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found.",
      });
    }

    const nextVersion =
      currentConfig.config_version + 1;

    const updatedConfig =
      await Config.create({
        config_version: nextVersion,

        business:
          business || currentConfig.business,

        questions,

        modifiers:
          modifiers || currentConfig.modifiers,
      });

    return res.status(200).json({
      success: true,
      message: "Configuration updated successfully.",
      data: {
        config_version:
          updatedConfig.config_version,
      },
    });
  } catch (error) {
    console.error(
      "Error updating configuration:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update configuration.",
    });
  }
};