import { Config } from "../models/Config.js";

export const getPublicConfig = async (req, res) => {
  try {
    const config = await Config.findOne().sort({
      config_version: -1,
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found",
      });
    }

    const activeQuestions = config.questions
      .filter((question) => question.active)
      .sort((a, b) => a.order - b.order)
      .map((question) => ({
        key: question.key,
        order: question.order,
        label: question.label,
        type: question.type,
        unit: question.unit,
        required: question.required,
        min: question.min,
        max: question.max,
        active: question.active,
        options: question.options.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      }));

    return res.status(200).json({
      success: true,
      data: {
        config_version: config.config_version,
        business: {
          name: config.business.name,
          region: config.business.region,
          currency: config.business.currency,
        },
        questions: activeQuestions,
      },
    });
  } catch (error) {
    console.error("Error fetching public config:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch configuration",
    });
  }
};