"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return interviews as Interview[];
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  try {
    const { userId, limit = 20 } = params;
    const interviewsSnapshot = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get();

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return interviews as Interview[];
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const interview = await db.collection("interviews").doc(id).get();

    return interview.data() as Interview;
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;
  try {
    const formattedTranscript = transcript
      .map(
        (sentance: { role: string; content: string }) =>
          `-  ${sentance.role}: ${sentance.content}\n`
      )
      .join("");

    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    // Transform categoryScores from object to array format
    const categoryScoresArray = Object.entries(categoryScores).map(
      ([name, data]) => ({
        name:
          name === "culturalFit"
            ? "Cultural & Role Fit"
            : name === "technicalKnowledge"
            ? "Technical Knowledge"
            : name === "problemSolving"
            ? "Problem-Solving"
            : name === "confidence"
            ? "Confidence & Clarity"
            : name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        score: data.score,
        comment: data.comment,
      })
    );

    const feedback = await db.collection("feedback").add({
      interviewId,
      userId,
      totalScore,
      categoryScores: categoryScoresArray,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });
    // let feedbackRef;

    // if (feedbackId) {
    //   feedbackRef = db.collection("feedback").doc(feedbackId);
    // } else {
    //   feedbackRef = db.collection("feedback").doc();
    // }

    // await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedback.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  try {
    const { interviewId, userId } = params;

    const feedbackSnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    console.log("Feedback snapshot empty?", feedbackSnapshot.empty);

    if (feedbackSnapshot.empty) {
      return null;
    }
    const feedbackDoc = feedbackSnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  } catch (error) {
    console.log("error -------->>>", error);
    return null;
  }
}
