import { AnswerRequest } from "@/types/AnswerInterfaces";

export async function createAnswer(
  token: string | null,
  answerRequest: AnswerRequest
) {
  try {
    // Set headers conditionally based on token presence
    // const config = token
    //   ? {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    //   : {};
    // await client.post("/answers", answerRequest, config);
    return (
      "Answer created successfully with token: " +
      token +
      " and request: " +
      JSON.stringify(answerRequest) +
      "on URL: /answers"
    );
  } catch (error: any) {
    // It's better to extract meaningful error messages if possible
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";

    throw new Error(
      `An error occurred while creating the prefab answer: ${errorMessage}`
    );
  }
}
