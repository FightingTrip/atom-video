export interface FilterOptions {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'contains';
  value: any;
}

export const filterData = (data: any[], filters: FilterOptions[]): any[] => {
  return data.filter((item) =>
    filters.every((filter) => {
      const fieldValue = item[filter.field];

      switch (filter.operator) {
        case 'eq':
          return fieldValue === filter.value;
        case 'gt':
          return fieldValue > filter.value;
        case 'lt':
          return fieldValue < filter.value;
        case 'contains':
          return String(fieldValue)
            .toLowerCase()
            .includes(String(filter.value).toLowerCase());
        default:
          return true;
      }
    })
  );
};
