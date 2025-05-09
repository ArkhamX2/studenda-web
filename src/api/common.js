export const getGroupById = async (groupId) => {
  // Mocked API response based on the swagger definition
  if (groupId === 1) {
    return {
      ok: true,
      json: async () => ({
        id: 1,
        name: "пин2406",
        courseId: 1,
        departmentId: 1,
        accounts: [],
      }),
    };
  } else {
    return {
      ok: false,
      json: async () => ({
        message: "Group not found",
      }),
    };
  }
};
