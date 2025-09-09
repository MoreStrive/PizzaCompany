// import StaffSystem from '@models/StaffSystem';
// import _Constants from '@configs/constants';

// const execute = async () => {
//   await StaffSystem.create({
//     fullName: 'Admin001',
//     username: 'admin001',
//     email: 'admin001@gmail.com',
//     password: 'admin001',
//     phone_number: '0333867228',
//     avatar: '',
//     dateOfBirth: '',
//     role: 'ADMIN',
//     joinDate: '',
//     salary: '',
//     bonus: [],
//     isVerify: true,
//     forgotPasswordToken: null,
//     forgotPasswordExpireAt: null,
//     gender: 'male',
//     status: _Constants.STATUS_ENUM.ACTIVE,
//   });
//   process.kill(process.pid);
// };

// execute();

import StaffSystem from '@models/StaffSystem';
import constants from '@configs/constants';

const execute = async () => {
  try {
    await StaffSystem.create({
      full_name: 'Admin001',
      username: 'admin001',
      email: 'admin001@gmail.com',
      password: await StaffSystem.hashPassword('admin001'),
      phone_number: '0333867228',
      avatar: '',
      date_of_birth: null,
      role: 'ADMIN',
      join_date: null,
      salary: null,
      bonus: JSON.stringify([]),
      is_verify: true,
      forgot_password_token: null,
      forgot_password_expire_at: null,
      gender: 'male',
      status: constants.STATUS_ENUM.ACTIVE,
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    process.exit();
  }
};

execute();
