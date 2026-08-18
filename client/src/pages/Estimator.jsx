import { useEffect, useState } from "react";
import { getEstimatorConfig } from "../services/api";
import QuestionField from "../components/dynamic/QuestionField";

function Estimator() {
  const [config, setConfig] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);

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

  function handleAnswerChange(key, value) {
    setAnswers((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading estimator...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!config) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {config.business?.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Get an estimate for your roofing project.
          </p>
        </div>

        <div className="space-y-6 rounded-xl bg-white p-6 shadow">
          {config.questions?.map((question) => (
            <QuestionField
              key={question.key}
              question={question}
              value={answers[question.key]}
              onChange={handleAnswerChange}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Estimator;