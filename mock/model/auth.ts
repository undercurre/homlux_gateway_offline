interface UserModel extends ApiAuth.UserInfo {
  token: string;
  password: string;
}

export const userModel: UserModel[] = [
  {
    token: '__TOKEN_NELOND__',
    userId: '0',
    userName: 'NELOND',
    userRole: 'super',
    password: 'nelond123456',
    mobilePhone: '15913609821'
  },
  {
    token: '__TOKEN_SUPER__',
    userId: '1',
    userName: 'Super',
    userRole: 'super',
    password: 'super123',
    mobilePhone: '15913609821'
  },
  {
    token: '__TOKEN_ADMIN__',
    userId: '2',
    userName: 'Admin',
    userRole: 'admin',
    password: 'admin123',
    mobilePhone: '15913609821'
  },
  {
    token: '__TOKEN_USER01__',
    userId: '3',
    userName: 'User01',
    userRole: 'user',
    password: 'user01123',
    mobilePhone: '15913609821'
  }
];
