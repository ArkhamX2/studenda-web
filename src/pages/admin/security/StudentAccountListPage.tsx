import React, { useEffect, useState } from "react";
import { getRoleByPermissions } from "../../../api/security/role";
import { getAccounts, deleteAccounts } from "../../../api/security/account";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Account } from "../../../types/security";
import { useSettings } from "../../../components/SettingsProvider";

const StudentAccountListPage: React.FC = () => {
  const navigate = useNavigate();
  const [studentAccounts, setStudentAccounts] = useState<Account[]>([]);
  const settings = useSettings();

  useEffect(() => {
    const fetchStudentAccounts = async () => {
      try {
        // Fetch role by permission
        const roleResponse = await getRoleByPermissions([settings.defaultPermission]);
        if (roleResponse.success && roleResponse.data && roleResponse.data.length > 0) {
          const studentRoleId = roleResponse.data[0].id;

          // Fetch accounts by role ID
          const accountsResponse = await getAccounts([studentRoleId]);
          if (accountsResponse.success && accountsResponse.data) {
            setStudentAccounts(accountsResponse.data);
          } else {
            console.warn("No accounts found for student role.");
            setStudentAccounts([]); // Fallback to empty array if no data
          }
        } else {
          console.error("No student role found");
          setStudentAccounts([]); // Fallback to empty array if no role
        }
      } catch (error) {
        console.error("Failed to fetch student accounts:", error);
        setStudentAccounts([]); // Fallback to empty array on error
      }
    };

    fetchStudentAccounts();
  }, [settings, settings?.studentPermission]);

  const renderContent = (entity: Account) => (
    <>
      <Typography variant="h6">{`${entity.surname} ${entity.name} ${entity.patronymic || ""}`}</Typography>
      <Typography variant="body2" color="textSecondary">{entity.email}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteAccounts([id]);
  };

  const StudentAccountCard: React.FC<{ entity: Account }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Account) => navigate(`/admin/user/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<Account>
      title="Студенты"
      fetchEntities={() => Promise.resolve({ success: true, data: studentAccounts })}
      ListItemComponent={StudentAccountCard}
      onCreate={() => navigate("/admin/user/edit")}
    />
  );
};

export default StudentAccountListPage;
