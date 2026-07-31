import { afterEach, describe, expect, it } from "vitest";
import { getModel } from "../src/compat.ts";
import { findEnvKeys, getEnvApiKey } from "../src/env-api-keys.ts";

const originalBasetenApiKey = process.env.BASETEN_API_KEY;

afterEach(() => {
	if (originalBasetenApiKey === undefined) {
		delete process.env.BASETEN_API_KEY;
	} else {
		process.env.BASETEN_API_KEY = originalBasetenApiKey;
	}
});

describe("Baseten models", () => {
	it("registers the default GLM-5.2 model via OpenAI-compatible Chat Completions API", () => {
		const model = getModel("baseten", "zai-org/GLM-5.2");

		expect(model).toBeDefined();
		expect(model.api).toBe("openai-completions");
		expect(model.provider).toBe("baseten");
		expect(model.baseUrl).toBe("https://inference.baseten.co/v1");
		expect(model.reasoning).toBe(true);
		expect(model.input).toEqual(["text"]);
		expect(model.contextWindow).toBe(1048576);
		expect(model.maxTokens).toBe(262144);
		expect(model.cost).toEqual({
			input: 1.4,
			output: 4.4,
			cacheRead: 0.3,
			cacheWrite: 0,
		});
	});

	it("resolves BASETEN_API_KEY from the environment", () => {
		process.env.BASETEN_API_KEY = "test-baseten-key";

		expect(findEnvKeys("baseten")).toEqual(["BASETEN_API_KEY"]);
		expect(getEnvApiKey("baseten")).toBe("test-baseten-key");
	});

	it("returns undefined when BASETEN_API_KEY is not set", () => {
		delete process.env.BASETEN_API_KEY;

		// findEnvKeys filters to env vars that are actually set, so it returns
		// undefined (not ["BASETEN_API_KEY"]) when the var is absent.
		expect(findEnvKeys("baseten")).toBeUndefined();
		expect(getEnvApiKey("baseten")).toBeUndefined();
	});
});
