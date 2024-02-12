import db from './db';

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  if (!memberOneId || !memberTwoId) return null;

  try {
    const conversation = await getConversation(memberOneId, memberTwoId) || await getConversation(memberTwoId, memberOneId);

    if (conversation) return conversation;

    return await createConversation(memberOneId, memberTwoId);
  } catch (err) {
    return null;
  }
};

export const getConversation = async (memberOneId: string, memberTwoId: string) => {
  if (!memberOneId || !memberTwoId) return null;

  try {
    return await db.conversation.findFirst({
      where: {
        AND: [
          { memberOneId }, { memberTwoId }
        ]
      },
      include: {
        memberOne: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        memberTwo: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    });
  } catch (err) {
    return null;
  }
};

export const createConversation = async (memberOneId: string, memberTwoId: string) => {
  if (!memberOneId || !memberTwoId) return null;

  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId
      },
      include: {
        memberOne: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        memberTwo: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    });
  } catch (err) {
    return null;
  }
};