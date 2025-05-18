import React, { useEffect, useState } from "react";
import { getRoleByPermissions } from "../../../api/security/role";
import { getAccountByRoles, deleteAccounts } from "../../../api/security/account";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Account } from "../../../types/security";
import { useSettings } from "../../../components/SettingsProvider";

const TeacherAccountListPage: React.FC = () => {
  const navigate = useNavigate();
  const [teacherAccounts, setTeacherAccounts] = useState<Account[]>([]);
  const settings = useSettings();

  useEffect(() => {
    const fetchTeacherAccounts = async () => {
      try {
        // Fetch role by permission
        const roleResponse = await getRoleByPermissions([settings.teacherPermission]);
        if (roleResponse.success && roleResponse.data && roleResponse.data.length > 0) {
          const teacherRoleId = roleResponse.data[0].id;

          // Fetch accounts by role ID
          const accountsResponse = await getAccountByRoles([teacherRoleId]);
          if (accountsResponse.success && accountsResponse.data) {
            setTeacherAccounts(accountsResponse.data);
          } else {
            console.warn("No accounts found for teacher role.");
            setTeacherAccounts([]); // Fallback to empty array if no data
          }
        } else {
          console.error("No teacher role found");
          setTeacherAccounts([]); // Fallback to empty array if no role
        }
      } catch (error) {
        console.error("Failed to fetch teacher accounts:", error);
        setTeacherAccounts([]); // Fallback to empty array on error
      }
    };

    fetchTeacherAccounts();
  }, [settings, settings?.teacherPermission]);

  const renderContent = (entity: Account) => (
    <>
      <Typography variant="h6">{`${entity.surname} ${entity.name} ${entity.patronymic || ""}`}</Typography>
      <Typography variant="body2" color="textSecondary">{entity.email}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteAccounts([id]);
  };

  const TeacherAccountCard: React.FC<{ entity: Account }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Account) => navigate(`/admin/user/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<Account>
      title="Преподаватели"
      fetchEntities={() => Promise.resolve({ success: true, data: teacherAccounts })}
      ListItemComponent={TeacherAccountCard}
      onCreate={() => navigate("/admin/user/edit")}
    />
  );
};

export default TeacherAccountListPage;
