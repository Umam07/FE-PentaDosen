import React from 'react';
import { GraduationCap, Clock } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { TableFilterHeader } from '../../../../components/shared/TableFilterHeader';
import type { AllDocumentsFilterBarProps } from '../types/adminAllDocuments.types';

export default function AllDocumentsFilterBar({
  activeTab,
  tabDetails,
  searchTerm,
  selectedFakultas,
  sortOrder,
  userRole,
  onSearchChange,
  onFakultasChange,
  onSortOrderChange,
}: AllDocumentsFilterBarProps) {
  const currentTabInfo = tabDetails[activeTab];
  const IconComponent = currentTabInfo.icon;
  const hasActiveFilter = Boolean(searchTerm || selectedFakultas || sortOrder !== 'desc');

  return (
    <TableFilterHeader
      icon={IconComponent}
      iconColorClass={`border ${currentTabInfo.colorClass}`}
      title={currentTabInfo.title}
      description={currentTabInfo.description}
      showSearch
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder={`Cari judul, dosen, atau kategori ${activeTab}...`}
      searchWidthClassName="w-full sm:w-[280px] md:w-[320px] xl:w-[360px]"
      hasActiveFilter={hasActiveFilter}
      onResetFilters={() => {
        onSearchChange('');
        onFakultasChange('');
        onSortOrderChange('desc');
      }}
    >
      {userRole === 'admin penelitian' && (
        <div className="w-full sm:w-[210px] md:w-[230px] shrink-0">
          <DropdownSelect
            value={selectedFakultas}
            onChange={(val) => onFakultasChange(String(val))}
            options={[
              { value: "", label: "Semua Fakultas" },
              { value: "Fakultas Kedokteran", label: "Kedokteran" },
              { value: "Fakultas Kedokteran Gigi", label: "Kedokteran Gigi" },
              { value: "Fakultas Teknologi Informasi", label: "Teknologi Informasi" },
              { value: "Fakultas Ekonomi dan Bisnis", label: "Ekonomi dan Bisnis" },
              { value: "Fakultas Hukum", label: "Hukum" },
              { value: "Fakultas Psikologi", label: "Psikologi" },
            ]}
            icon={<GraduationCap className="w-4 h-4" />}
          />
        </div>
      )}

      <div className="w-full sm:w-[160px] shrink-0">
        <DropdownSelect
          value={sortOrder}
          onChange={(val) => onSortOrderChange(val as 'desc' | 'asc')}
          options={[
            { value: "desc", label: "Terbaru" },
            { value: "asc", label: "Terlama" },
          ]}
          icon={<Clock className="w-4 h-4" />}
        />
      </div>
    </TableFilterHeader>
  );
}

