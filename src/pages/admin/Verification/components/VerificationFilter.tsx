import React from 'react';
import { Beaker, ShieldAlert, GraduationCap, Clock } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { TableFilterHeader } from '../../../../components/ui/TableFilterHeader';
import { VerificationFilterProps } from '../types/verification.types';

export default function VerificationFilter({
  activeTab,
  searchTerm,
  onSearchChange,
  selectedFakultas,
  onFakultasChange,
  sortOrder,
  onSortOrderChange,
  userRole
}: VerificationFilterProps) {
  const getTabText = () => {
    switch (activeTab) {
      case 'publikasi': return 'Publikasi';
      case 'hki': return 'HKI';
      case 'buku': return 'Buku';
      case 'penelitian': return 'Penelitian';
      default: return 'Dokumen';
    }
  };

  const hasActiveFilter = Boolean(searchTerm || selectedFakultas || sortOrder !== 'desc');

  return (
    <TableFilterHeader
      icon={activeTab === 'penelitian' ? Beaker : ShieldAlert}
      title={`Queue Verifikasi ${getTabText()}`}
      description={`${userRole === 'admin penelitian' ? 'Penelitian' : 'Fakultas'} • Pending Approval`}
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

