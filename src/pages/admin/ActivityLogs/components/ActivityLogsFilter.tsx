import React from 'react';
import { Activity } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { TableFilterHeader } from '../../../../components/ui/TableFilterHeader';
import { ActivityLogsFilterProps } from '../types/activityLogs.types';

export default function ActivityLogsFilter({
  searchTerm,
  onSearchChange,
  selectedAction,
  onActionChange,
  userRole
}: ActivityLogsFilterProps) {
  const hasActiveFilter = Boolean(searchTerm || selectedAction);

  return (
    <TableFilterHeader
      icon={Activity}
      title="Riwayat Log Sistem"
      description={`${userRole === 'admin penelitian' ? 'Penelitian' : 'Fakultas'} • Audit Trail`}
      showSearch
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Cari aksi, deskripsi, atau nama dosen..."
      searchWidthClassName="w-full sm:w-[280px] md:w-[320px] xl:w-[360px]"
      hasActiveFilter={hasActiveFilter}
      onResetFilters={() => {
        onSearchChange('');
        onActionChange('');
      }}
    >
      <div className="w-full sm:w-[220px] shrink-0">
        <DropdownSelect
          value={selectedAction}
          onChange={(val) => onActionChange(String(val))}
          options={[
            { value: "", label: "Semua Aksi" },
            { value: "create", label: "Create (Submit/Upload)" },
            { value: "login", label: "Login" },
            { value: "logout", label: "Logout" },
            { value: "sync", label: "Sync (Scholar/Scopus)" },
            { value: "verify", label: "Verify (Admin Action)" }
          ]}
          icon={<Activity className="w-4 h-4" />}
        />
      </div>
    </TableFilterHeader>
  );
}

