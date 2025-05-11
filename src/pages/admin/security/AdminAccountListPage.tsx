import React, { useEffect, useState } from "react";
import { getRoleByPermissions } from "../../../api/security/role";
import { getAccounts, deleteAccounts } from "../../../api/security/account";
import EntityListPage from "../../../components/admin/EntityListPage";
import EntityListItem from "../../../components/admin/EntityListItem";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Account } from "../../../types/security";
import { useSettings } from "../../../components/SettingsProvider";

const AdminAccountListPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminAccounts, setAdminAccounts] = useState<Account[]>([]);
  const settings = useSettings();

  useEffect(() => {
    const fetchAdminAccounts = async () => {
      try {
        // Fetch role by permission
        const roleResponse = await getRoleByPermissions([settings.adminPermission]);
        if (roleResponse.success && roleResponse.data && roleResponse.data.length > 0) {
          const adminRoleId = roleResponse.data[0].id;

          // Fetch accounts by role ID
          const accountsResponse = await getAccounts([adminRoleId]);
          if (accountsResponse.success && accountsResponse.data) {
            setAdminAccounts(accountsResponse.data);
          } else {
            console.warn("No accounts found for admin role.");
            setAdminAccounts([]); // Fallback to empty array if no data
          }
        } else {
          console.error("No admin role found");
          setAdminAccounts([]); // Fallback to empty array if no role
        }
      } catch (error) {
        console.error("Failed to fetch admin accounts:", error);
        setAdminAccounts([]); // Fallback to empty array on error
      }
    };

    fetchAdminAccounts();
  }, [settings, settings?.adminPermission]);

  const renderContent = (entity: Account) => (
    <>
      <Typography variant="h6">{`${entity.surname} ${entity.name} ${entity.patronymic || ""}`}</Typography>
      <Typography variant="body2" color="textSecondary">{entity.email}</Typography>
    </>
  );

  const handleDelete = async (id: number): Promise<void> => {
    await deleteAccounts([id]);
  };

  const AdminAccountCard: React.FC<{ entity: Account }> = ({ entity }) => (
    <EntityListItem
      entity={entity}
      onRender={renderContent}
      onDelete={handleDelete}
      onEdit={(entity: Account) => navigate(`/admin/user/edit/${entity.id}`)}
    />
  );

  return (
    <EntityListPage<Account>
      title="Администраторы"
      fetchEntities={() => Promise.resolve({ success: true, data: adminAccounts })}
      ListItemComponent={AdminAccountCard}
      onCreate={() => navigate("/admin/user/edit")}
    />
  );
};

export default AdminAccountListPage;
