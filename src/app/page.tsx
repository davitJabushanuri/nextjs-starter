import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { API_URL } from "@/config";
import { logger } from "@/utils/logger";

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

export default async function Home() {
  return (
    <div>
      <h1 className="">Nextjs starter</h1>
      <ErrorBoundary fallback={<div>hello</div>}>
        <Suspense fallback={<div>Loading user...</div>}>
          <User />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

async function User() {
  const user = await getUser();

  return (
    <div className="user-info">
      <h2 className="font-bold text-2xl">User Information</h2>
      <p className="text-lg">Name: {user.firstName}</p>
      <p className="text-lg">Last Name: {user.lastName}</p>
      <p>{Math.random()}</p>
    </div>
  );
}

const getUser = async (): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }

    return (await response.json()) as User;
  } catch (error) {
    logger.error("Failed to fetch user:", error);
    throw error;
  }
};
