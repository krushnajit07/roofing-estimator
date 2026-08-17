export const calculateEstimate = (config, answers) => {
    const { questions, modifiers } = config;

    const roofArea = Number(answers.roof_area);

    const getQuestion = (key) => {
        return questions.find((question) => question.key === key);
    };

    const getSelectedOption = (questionKey) => {
        const question = getQuestion(questionKey);

        if (!question || !question.options) {
            return null;
        }

        const selectedValue = answers[questionKey];

        return question.options.find(
            (option) => option.value === selectedValue
        );
    };

    const materialOption = getSelectedOption("material");
    const pitchOption = getSelectedOption("pitch");
    const layersOption = getSelectedOption("layers");
    const storiesOption = getSelectedOption("stories");

    if (
        !materialOption ||
        !pitchOption ||
        !layersOption ||
        !storiesOption
    ) {
        throw new Error("Invalid estimator option selection.");
    }

    const ratePerSqft = Number(materialOption.rate_per_sqft);
    const pitchMultiplier = Number(pitchOption.multiplier);
    const tearOffPerSqft = Number(
        layersOption.tear_off_per_sqft
    );
    const storiesMultiplier = Number(
        storiesOption.multiplier
    );

    const wasteFactor = Number(modifiers.waste_factor);
    const permitFee = Number(modifiers.permit_flat_fee);
    const spread = Number(modifiers.range_spread_pct) / 100;

    const baseMaterialCost =
        roofArea * ratePerSqft * (1 + wasteFactor);

    const tearOffCost =
        roofArea * tearOffPerSqft;

    const adjustedSubtotal =
        (baseMaterialCost + tearOffCost) *
        pitchMultiplier *
        storiesMultiplier;

    const midEstimate =
        adjustedSubtotal + permitFee;

    const estimateLow =
        Math.round(midEstimate * (1 - spread));

    const estimateHigh =
        Math.round(midEstimate * (1 + spread));

    return {
        estimate_low: estimateLow,
        estimate_high: estimateHigh,
    };
};