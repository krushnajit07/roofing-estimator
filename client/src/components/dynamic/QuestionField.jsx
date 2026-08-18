function QuestionField({ question, value, onChange }) {
  if (!question.active) {
    return null;
  }

  if (question.type === "number") {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {question.label}
          {question.unit && ` (${question.unit})`}
        </label>

        <input
          type="number"
          value={value ?? ""}
          min={question.min}
          max={question.max}
          required={question.required}
          onChange={(event) => {
            const rawValue = event.target.value;

            onChange(
              question.key,
              rawValue === "" ? "" : Number(rawValue)
            );
          }}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        {(question.min !== undefined || question.max !== undefined) && (
          <p className="text-sm text-gray-500">
            {question.min !== undefined && `Minimum: ${question.min}`}
            {question.min !== undefined && question.max !== undefined && " • "}
            {question.max !== undefined && `Maximum: ${question.max}`}
          </p>
        )}
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          {question.label}
        </label>

        <div className="space-y-2">
          {question.options?.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition ${
                value === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <span>{option.label}</span>

              <input
                type="radio"
                name={question.key}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(question.key, option.value)}
              />
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default QuestionField;