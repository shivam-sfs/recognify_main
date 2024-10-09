// edit module props

interface UserModalType {
  id: number;
  isActive: boolean,
  onClose: react.Dispatch<react.SetStateAction<boolean>>;
  data?: any
}

interface ActionModalType {
  id: number;
  isActive: boolean,
  onClose: react.Dispatch<react.SetStateAction<string>>;
  data?: any
  type: string
  urls: string
  path: string
}


interface MainActionModalType extends ActionModalType {
  formData?: boolean
  form?: boolean
  validationSchema?: any,
  initValue?: any,
  onSuccess?: () => void,
  onError?: () => void
  addValue?: any
  addFiles?: any
  deleteValue?: string[]
}


interface childrenType {
  children: ReactNode;
}

interface farmError {
  email?: string
  name?: string
  password?: string
}

interface userTokenType {
  userToken: {
    user_id: number,
    email: staring,
    role: string,
    roleText: string,
    image: string
    loggedInWith: string
    token: string
  } | null

}



interface CustomTable {
  key?: string;
  value: string;
  index?: boolean;
  className?: staring;
  combine?: string[];
  component?: React.FC<any>;
};


interface RememberMeState {
  email: string;
  password: string;
  rememberme: boolean;
}


interface LogCredential {
  email: string;
  password: string;
}

interface FilterDataType {
  limit: number;
  startDate: Date | string;
  endDate: Date | string;
  searchParam: string;
  orderBy: string | undefined;
  order: string | undefined;
  property_type?: string | undefined;
  property_for?: string | undefined;
}

interface filter {
  filter: FilterDataType,
  setFilter: React.Dispatch<React.SetStateAction<filter.filter>>
  disable?: string[]
  orderBy?: string[]
}

interface userType {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  address?: string;
  contact_number?: number;
  email?: string;
  role?: string;
  zip_code?: number,
  local_area?: number[],
  city?: string,
  state?: string,
  coordinates?: { lat: number, lng: number }
  oldImage?: string;
  image?: string;
  is_active?: number;
  is_deleted?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
}

interface userDataInTable {
  data: userType
}


interface editUserType extends userType {
  password?: string;
  confirm_password?: string;
}
interface userDataType {
  list?: userType[];
  pagination?: {
    limit?: string;
    offset?: string;
    total?: number;
  };
}

interface categoryDataType {
  category_id: number;
  category_name: string;
  sub_category: SubCategoryType[];
}

interface actionButtons {
  data: any,
  setSelected: React.Dispatch<any>
  setEdit: React.Dispatch<string>
  id: string | number
}


interface LatLng {
  latLng: {
    equals(other: google.maps.LatLng | null): boolean;
    lat(): number;
    lng(): number;
    toJSON(): google.maps.LatLngLiteral;
    toString(): string;
    toUrlValue(precision?: number): string;
  }
}