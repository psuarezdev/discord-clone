import type { NextApiRequest } from 'next';
import { auth, currentUser, redirectToSignIn } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import db from '@/lib/db';

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const userFound = await db.user.findUnique({
    where: {
      id: user.id
    }
  });

  if (userFound) return userFound;

  const newUser = await db.user.create({
    data: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.imageUrl,
      email: user.emailAddresses[0].emailAddress
    }
  });

  return newUser;
};

export const getProfile = async () => {
  try {
    const { userId } = auth();

    if (!userId) return null;

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    });

    return user;
  } catch (err) {
    return null;
  }
};

export const getProfilePages = async (req: NextApiRequest) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) return null;

    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    });

    return user;
  } catch (err) {
    return null;
  }
}
