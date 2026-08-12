import React from 'react';
import { Users, GraduationCap } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { TableFilterHeader } from '../../../../components/ui/TableFilterHeader';
import { LecturersFilterProps } from '../types/lecturers.types';

export default function LecturersFilter({
  searchTerm,
  onSearchChange,
  selectedFakultas,
  onFakultasChange,
  userRole
}: LecturersFilterProps) {
  const hasActiveFilter = Boolean(searchTerm || selectedFakultas);

  return (
    <TableFilterHeader
      icon={Users}
      title="Eksplorasi Profil"
      description={`Daftar Dosen di Lingkungan ${userRole === 'admin penelitian' ? 'Universitas' : 'Fakultas'}`}
      showSearch
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Cari nama dosen atau program studi..."
      searchWidthClassName="w-full sm:w-[280px] md:w-[320px] xl:w-[360px]"
      hasActiveFilter={hasActiveFilter}
      onResetFilters={() => {
        onSearchChange('');
        onFakultasChange('');
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
    </TableFilterHeader>
  );
}

