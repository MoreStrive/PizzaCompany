export default class Constants {
    // Trạng thái người dùng
    public static readonly STATUS_ENUM = {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      PENDING: 'pending',
    };

    // Giới tính người dùng
    public static readonly GENDER_ENUM = {
      MALE: 'male',
      FEMALE: 'female',
      OTHER: 'other',
    };

    // Phân loại khách hàng
    public static readonly CUSTOMER_CLASS_ENUM = {
      BRONZE: 'Bronze',
      SILVER: 'Silver',
      GOLD: 'Gold',
      DIAMOND: 'Diamond',
    };

    // Điều kiện để đạt phân loại khách hàng
    public static readonly CUSTOMER_CLASS_CONDITION_ENUM = {
      SILVER: 2000000,
      GOLD: 5000000,
      DIAMOND: 10000000,
    };

    // Quyền hạn người dùng
    public static readonly ROLE_ENUM = {
      USER: 'USER',
      ADMIN: 'ADMIN',
      MANAGER: 'MANAGE',
      STAFF: 'STAFF',
    };

    // Các tham số được phép khi tạo người dùng
    public static readonly CREATABLE_PARAMETERS = [
      'username',
      'full_name',
      'email',
      'phoneNumber',
      'password',
      'avatar',
      'acceptPolicy',
      'status',
      'gender',
      'address',
    ];

    // Các tham số được phép khi cập nhật thông tin người dùng
    public static readonly UPDATABLE_PARAMETERS = [
      'full_name',
      'phoneNumber',
      'password',
      'avatar',
      'acceptPolicy',
      'gender',
      'address',
    ];

    // Các tham số được phép khi admin cập nhật thông tin người dùng
    public static readonly ADMIN_UPDATABLE_PARAMETERS = [
      'full_name',
      'phoneNumber',
      'password',
      'avatar',
      'acceptPolicy',
      'customerClass',
      'accumulatedPoint',
      'status',
      'gender',
      'address',
    ];

    // Các tham số được phép khi admin tạo người dùng
    public static readonly ADMIN_CREATABLE_PARAMETERS = [
      'username',
      'full_name',
      'email',
      'phoneNumber',
      'password',
      'avatar',
      'acceptPolicy',
      'status',
      'gender',
      'address',
    ];

    public static readonly MANAGE_CREATABLE_STAFF_PARAMETERS = ['username', 'full_name', 'email', 'phone_number', 'password', 'date_of_birth', 'avatar', 'gender', 'address'];
    public static readonly ADMIN_CREATABLE_STAFF_PARAMETERS = ['username', 'full_name', 'email', 'phone_number', 'password', 'date_of_birth', 'avatar', 'status', 'role', 'salary', 'gender', 'address', 'join_date'];

    public static readonly MANAGE_UPDATEABLE_STAFF_PARAMETERS = ['full_name', 'email', 'status', 'phone_number', 'password', 'date_of_birth', 'avatar', 'gender', 'address'];
    public static readonly ADMIN_UPDATEABLE_STAFF_PARAMETERS = ['full_name', 'email', 'phone_number', 'password', 'avatar', 'date_of_birth', 'status', 'role', 'salary', 'gender', 'address', 'join_date'];

    public static readonly CONDITION_ENUM = { LEVEL_CUSTOM: 'LEVEL_CUSTOM', ALL: 'ALL', MIN_PRICE: 'MIN_PRICE' };
    public static readonly DISCOUNT_ENUM = { PERCENT: 'percent', CASH: 'cash' };
    public static readonly ERROR_NOTE = {
      LEVEL_CUSTOM: 'Hạng của bạn chưa đủ để áp dụng mã này',
      MIN_PRICE: 'Giá trị đơn hàng chưa đủ để áp dụng mã này',
      EXPIRATION: 'Mã đã hết hạn',
      LIMIT: 'Bạn đã hết lượt sử dụng của mã này',
      MAX_COUNT: 'Mã đã hết!',
    };

    public static readonly ORDER_STATUS_ENUM = {
      DENIED: 'denied',
      COOKING: 'cooking',
      REJECT: 'reject',
      ACCEPT: 'accept',
      SUCCESS: 'success',
      DELIVERING: 'delivering',
      PENDING: 'pending',
      DRAFT: 'draft',
    };
}
