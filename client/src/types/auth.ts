export interface SignInParams {
  email: string;
  password?: string;
}

export interface SignUpParams {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
}
