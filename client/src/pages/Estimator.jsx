import { useEffect, useMemo, useState } from "react";
import { getEstimatorConfig, submitEstimate } from "../services/api";
import QuestionField from "../components/dynamic/QuestionField";

function Estimator() {
  const [config, setConfig] = useState(null);
  const [answers, setAnswers] = useState({});

  const [currentStep, setCurrentStep] = useState(0);

  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        setError("");

        const {data} = await getEstimatorConfig();
        
        setConfig(data);
      } catch (err) {
        setError(err.message || "Unable to load estimator");
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  const questions = useMemo(() => {
    return config?.questions?.filter((question) => question.active) || [];
  }, [config]);

  const totalSteps = questions.length + 1;

  const isContactStep = currentStep === questions.length;

  function handleAnswerChange(key, value) {
    setAnswers((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function handleContactChange(event) {
    const { name, value } = event.target;

    setContact((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function validateCurrentStep() {
    if (isContactStep) {
      if (!contact.name.trim()) {
        setError("Please enter your name.");
        return false;
      }

      if (!contact.phone.trim()) {
        setError("Please enter your phone number.");
        return false;
      }

      if (!contact.email.trim()) {
        setError("Please enter your email address.");
        return false;
      }

      setError("");
      return true;
    }

    const question = questions[currentStep];

    if (!question) {
      return true;
    }

    const value = answers[question.key];

    if (
      question.required &&
      (value === undefined || value === null || value === "")
    ) {
      setError("Please answer this question before continuing.");
      return false;
    }

    if (question.type === "number" && value !== "") {
      if (question.min !== undefined && value < question.min) {
        setError(`Value must be at least ${question.min}.`);
        return false;
      }

      if (question.max !== undefined && value > question.max) {
        setError(`Value must not exceed ${question.max}.`);
        return false;
      }
    }

    setError("");
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) {
      return;
    }

    setCurrentStep((previous) => previous + 1);
  }

  function handleBack() {
    setError("");

    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        name: contact.name.trim(),
        phone: contact.phone.trim(),
        email: contact.email.trim(),
        answers,
      };

      const data = await submitEstimate(payload);

      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate estimate.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading estimator...</p>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  if (result) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <p className="mb-3 text-sm font-medium text-blue-600">
              Estimate Ready
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Your Estimated Roofing Cost
            </h1>

            <p className="mt-4 text-4xl font-bold text-gray-900">
              {config.business?.currency === "USD" ? "$" : ""}
              {Number(result.estimate_low).toLocaleString()}
              {" - "}
              {config.business?.currency === "USD" ? "$" : ""}
              {Number(result.estimate_high).toLocaleString()}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              This is an estimated range based on the information you provided.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            {config.business?.name}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Roofing Estimate
          </h1>

          <p className="mt-2 text-gray-600">
            Answer a few questions to get an estimated cost.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-gray-500">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>

            <span>
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        <form
          onSubmit={
            isContactStep
              ? handleSubmit
              : (event) => {
                  event.preventDefault();
                  handleNext();
                }
          }
          className="rounded-2xl bg-white p-6 shadow"
        >
          {!isContactStep && currentQuestion && (
            <QuestionField
              question={currentQuestion}
              value={answers[currentQuestion.key]}
              onChange={handleAnswerChange}
            />
          )}

          {isContactStep && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Almost there
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Enter your contact details to receive your estimate.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={contact.name}
                  onChange={handleContactChange}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={contact.phone}
                  onChange={handleContactChange}
                  placeholder="Your phone number"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0 || submitting}
              className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            {!isContactStep ? (
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Calculating..." : "Get My Estimate"}
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

export default Estimator;