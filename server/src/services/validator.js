export const validateEstimateInput = (config, answers) => {
    const errors = {};

    for (const question of config.questions) {
        if (!question.active) {
            continue;
        }

        const answer = answers[question.key];

        if (
            question.required &&
            (answer === undefined ||
                answer === null ||
                answer === "")
        ) {
            errors[question.key] = "This field is required.";
            continue;
        }

        if (question.type === "number" && answer !== undefined) {
            const numericValue = Number(answer);

            if (Number.isNaN(numericValue)) {
                errors[question.key] = "Please enter a valid number.";
                continue;
            }

            if (
                question.min !== undefined &&
                numericValue < question.min
            ) {
                errors[
                    question.key
                ] = `Value must be at least ${question.min}.`;
            }

            if (
                question.max !== undefined &&
                numericValue > question.max
            ) {
                errors[
                    question.key
                ] = `Value must be at most ${question.max}.`;
            }
        }

        if (question.type === "select" && answer !== undefined) {
            const validOption = question.options.some(
                (option) => option.value === answer
            );

            if (!validOption) {
                errors[question.key] = "Invalid option selected.";
            }
        }
    }

    return errors;
};