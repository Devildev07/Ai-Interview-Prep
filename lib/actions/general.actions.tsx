import { db } from "@/firebase/admin";

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
