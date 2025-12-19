export interface Staff {
  staff_id: number;
  first_name: string;
  last_name: string;
  staff_role?: string;
  email: string;
  phone: string;
  status: string;
  photo?: string | null;
}