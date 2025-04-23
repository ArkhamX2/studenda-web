export const login = async (email, password) => {
  // Mocked API response based on real server structure
  if (email === "admin@example.com" && password === "admin123") {
    const response = {
      ok: true,
      json: async () => ({
        $id: "1",
        Account: {
          $id: "2",
          RoleId: 1,
          IdentityId: "d27a4fd1-228b-415b-985d-828fb7849152",
          Email: "admin@example.com",
          Name: "Admin",
          Surname: "User",
          Patronymic: "Adminovich",
          Role: {
            $id: "3",
            Name: "Администратор",
            Permission: "ru.arkham.permission.admin",
            TokenLifetimeSeconds: 86400,
            Accounts: { $id: "4", $values: [{ $ref: "2" }] },
            Id: 1,
            CreatedAt: "2025-04-23T19:13:44",
          },
          Subjects: { $id: "5", $values: [] },
          SubjectChanges: { $id: "6", $values: [] },
          Disciplines: { $id: "7", $values: [] },
          Absences: { $id: "8", $values: [] },
          IssuedTasks: { $id: "9", $values: [] },
          AssignedTasks: { $id: "10", $values: [] },
          Id: 1,
          CreatedAt: "2025-04-23T19:13:44",
        },
        Token: "mocked-admin-token",
      }),
    };
    return response;
  } else if (email === "teacher@example.com" && password === "teacher123") {
    const response = {
      ok: true,
      json: async () => ({
        $id: "1",
        Account: {
          $id: "2",
          RoleId: 2,
          IdentityId: "e37b5fd1-228b-415b-985d-828fb7849153",
          Email: "teacher@example.com",
          Name: "Teacher",
          Surname: "User",
          Patronymic: "Teachovich",
          Role: {
            $id: "3",
            Name: "Преподаватель",
            Permission: "ru.arkham.permission.teacher",
            TokenLifetimeSeconds: 86400,
            Accounts: { $id: "4", $values: [{ $ref: "2" }] },
            Id: 2,
            CreatedAt: "2025-04-23T19:13:44",
          },
          Subjects: { $id: "5", $values: [] },
          SubjectChanges: { $id: "6", $values: [] },
          Disciplines: { $id: "7", $values: [] },
          Absences: { $id: "8", $values: [] },
          IssuedTasks: { $id: "9", $values: [] },
          AssignedTasks: { $id: "10", $values: [] },
          Id: 2,
          CreatedAt: "2025-04-23T19:13:44",
        },
        Token: "mocked-teacher-token",
      }),
    };
    return response;
  } else if (email === "student@example.com" && password === "student123") {
    const response = {
      ok: true,
      json: async () => ({
        $id: "1",
        Account: {
          $id: "2",
          RoleId: 3,
          IdentityId: "f47c6fd1-228b-415b-985d-828fb7849154",
          Email: "student@example.com",
          Name: "Student",
          Surname: "User",
          Patronymic: "Studentovich",
          Role: {
            $id: "3",
            Name: "Студент",
            Permission: "ru.arkham.permission.student",
            TokenLifetimeSeconds: 86400,
            Accounts: { $id: "4", $values: [{ $ref: "2" }] },
            Id: 3,
            CreatedAt: "2025-04-23T19:13:44",
          },
          Subjects: { $id: "5", $values: [] },
          SubjectChanges: { $id: "6", $values: [] },
          Disciplines: { $id: "7", $values: [] },
          Absences: { $id: "8", $values: [] },
          IssuedTasks: { $id: "9", $values: [] },
          AssignedTasks: { $id: "10", $values: [] },
          Id: 3,
          CreatedAt: "2025-04-23T19:13:44",
        },
        Token: "mocked-student-token",
      }),
    };
    return response;
  } else {
    return {
      ok: false,
      json: async () => ({
        message: "Invalid email or password",
      }),
    };
  }
};

export function getUserRole(token) {
  // Mock implementation: Replace with actual API call if needed
  if (token === "mocked-admin-token") return "admin";
  if (token === "mocked-teacher-token") return "teacher";
  if (token === "mocked-student-token") return "student";
  return null;
}

export const fetchAndSaveSettings = async () => {
  const localSettings = localStorage.getItem("appSettings");

  if (localSettings) {
    return JSON.parse(localSettings);
  }

  // Mock response
  const settings = {
    defaultPermission: "ru.arkham.permission.default",
    leaderPermission: "ru.arkham.permission.leader",
    teacherPermission: "ru.arkham.permission.teacher",
    adminPermission: "ru.arkham.permission.admin",
    coordinatedUniversalTime: "2025-04-23T20:13:10.141328Z",
  };

  localStorage.setItem("appSettings", JSON.stringify(settings));
  return settings;
};

export const validateToken = async (token) => {
  // Mocked API response based on real server structure
  if (token === "mocked-admin-token") {
    return {
      ok: true,
      json: async () => ({
        $id: "1",
        Account: {
          $id: "2",
          RoleId: 1,
          IdentityId: "d27a4fd1-228b-415b-985d-828fb7849152",
          Email: "admin@example.com",
          Name: "Admin",
          Surname: "User",
          Patronymic: "Adminovich",
          Role: {
            $id: "3",
            Name: "Администратор",
            Permission: "ru.arkham.permission.admin",
            TokenLifetimeSeconds: 86400,
            Accounts: { $id: "4", $values: [{ $ref: "2" }] },
            Id: 1,
            CreatedAt: "2025-04-23T19:13:44",
          },
          Subjects: { $id: "5", $values: [] },
          SubjectChanges: { $id: "6", $values: [] },
          Disciplines: { $id: "7", $values: [] },
          Absences: { $id: "8", $values: [] },
          IssuedTasks: { $id: "9", $values: [] },
          AssignedTasks: { $id: "10", $values: [] },
          Id: 1,
          CreatedAt: "2025-04-23T19:13:44",
        },
        Token: "mocked-admin-token",
      }),
    };
  } else if (token === "mocked-teacher-token") {
    return {
      ok: true,
      json: async () => ({
        $id: "1",
        Account: {
          $id: "2",
          RoleId: 2,
          IdentityId: "e37b5fd1-228b-415b-985d-828fb7849153",
          Email: "teacher@example.com",
          Name: "Teacher",
          Surname: "User",
          Patronymic: "Teachovich",
          Role: {
            $id: "3",
            Name: "Преподаватель",
            Permission: "ru.arkham.permission.teacher",
            TokenLifetimeSeconds: 86400,
            Accounts: { $id: "4", $values: [{ $ref: "2" }] },
            Id: 2,
            CreatedAt: "2025-04-23T19:13:44",
          },
          Subjects: { $id: "5", $values: [] },
          SubjectChanges: { $id: "6", $values: [] },
          Disciplines: { $id: "7", $values: [] },
          Absences: { $id: "8", $values: [] },
          IssuedTasks: { $id: "9", $values: [] },
          AssignedTasks: { $id: "10", $values: [] },
          Id: 2,
          CreatedAt: "2025-04-23T19:13:44",
        },
        Token: "mocked-teacher-token",
      }),
    };
  } else if (token === "mocked-student-token") {
    return {
      ok: true,
      json: async () => ({
        $id: "1",
        Account: {
          $id: "2",
          RoleId: 3,
          IdentityId: "f47c6fd1-228b-415b-985d-828fb7849154",
          Email: "student@example.com",
          Name: "Student",
          Surname: "User",
          Patronymic: "Studentovich",
          Role: {
            $id: "3",
            Name: "Студент",
            Permission: "ru.arkham.permission.student",
            TokenLifetimeSeconds: 86400,
            Accounts: { $id: "4", $values: [{ $ref: "2" }] },
            Id: 3,
            CreatedAt: "2025-04-23T19:13:44",
          },
          Subjects: { $id: "5", $values: [] },
          SubjectChanges: { $id: "6", $values: [] },
          Disciplines: { $id: "7", $values: [] },
          Absences: { $id: "8", $values: [] },
          IssuedTasks: { $id: "9", $values: [] },
          AssignedTasks: { $id: "10", $values: [] },
          Id: 3,
          CreatedAt: "2025-04-23T19:13:44",
        },
        Token: "mocked-student-token",
      }),
    };
  } else {
    return {
      ok: false,
      status: 401,
      json: async () => ({
        message: "Unauthorized",
      }),
    };
  }
};