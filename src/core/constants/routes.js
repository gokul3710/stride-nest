const Routes = [
  ['USER', '/user', 'GET'],
  ['USER_SIGNIN', '/auth/signin', 'POST'],
  ['USER_LOGIN', '/auth/login', 'POST'],
  ['USER_SIGNUP', '/auth/signup', 'POST'],
  ['USER_SIGNIN_GOOGLE', '/auth/signin/google', 'POST'],
  ['USER_SIGNUP_GOOGLE', '/auth/signup/google', 'POST'],
  ['PROFILE_EDIT', '/user/profile', 'PATCH'],
  ['PROFILE_EDIT_USERNAME', '/user/profile/username', 'PATCH'],
  ['PROFILE_EDIT_EMAIL', '/user/profile/email', 'PATCH'],
  ['PROFILE_EDIT_PHONE', '/user/profile/phone', 'PATCH'],
  ['PROFILE_EDIT_IMAGE', '/user/profile/image', 'PATCH'],
  ['PROFILE_EDIT_PASSWORD', '/user/profile/password', 'PATCH'],
  ['GET_ADDRESS', '/user/address', 'GET'],
  ['ADD_ADDRESS', '/user/address', 'POST'],
  ['EDIT_ADDRESS', '/user/address', 'PATCH'],
  ['DELETE_ADDRESS', '/user/address/:addressId', 'DELETE'],
  ['SET_DEFAULT_ADDRESS', '/user/address/default', 'PATCH'],
  ['GET_PRODUCTS', '/product', 'GET'],
  ['GET_PRODUCT', '/product/:productId', 'GET'],
  ['FILTER_PRODUCT', '/product/filter/:page', 'GET'],
  ['SEARCH_PRODUCT', '/product/search', 'GET'],
  ['GET_CART_PRODUCTS', '/user/cart', 'GET'],
  ['GET_CART_TOTAL', '/user/cart/total', 'GET'],
  ['ADD_TO_CART', '/user/cart', 'POST'],
  ['REMOVE_FROM_CART', '/user/cart/:productId', 'DELETE'],
  ['CHANGE_QUANTITY', '/user/cart', 'PATCH'],
  ['GET_ORDERS', '/user/order', 'GET'],
  ['PLACE_ORDER', '/user/order', 'POST'],
  ['CANCEL_ORDER', '/user/order/cancel', 'PATCH'],
  ['RETURN_ORDER', '/user/order/return', 'PATCH'],
  ['GET_BANNERS', '/banner/active', 'GET'],
  ['GET_BRANDS', '/brand', 'GET'],
  ['GET_BRAND_BY_ID', '/brand/:brandId', 'GET'],
  ['GET_PAYMENTS', '/user/payment', 'GET'],
  ['USER_SESSION', '/user/session', 'POST'],
  ['GET_NOTIFICATION', '/notification', 'GET'],
  ['RESET_NOTIFICATION', '/user/notification/reset', 'PATCH'],
  ['CLEAR_NOTIFICATION', '/user/notification/clear', 'PATCH'],
  ['GET_COUPON', '/coupon', 'GET'],
  ['GET_COUPON_BY_CODE', '/coupon/:couponCode', 'GET'],
  ['ADD_COUPON_TO_CART', '/user/coupon/add', 'PATCH'],
  ['REMOVE_COUPON_FROM_CART', '/user/coupon/remove', 'PATCH'],
  ['ADMIN_LOGIN', '/admin', 'POST'],
  ['GET_ALL_USERS', '/admin/user', 'GET'],
  ['GET_USER_BY_ID', '/admin/user/:userId', 'GET'],
  ['BLOCK_USER', '/admin/user/:userId/block', 'PATCH'],
  ['UNBLOCK_USER', '/admin/user/:userId/unblock', 'PATCH'],
  ['ADD_PRODUCT', '/product', 'POST'],
  ['UPDATE_PRODUCT', '/product/:productId', 'PATCH'],
  ['UPDATE_PRODUCT_IMAGE', '/product/:productId/image', 'PATCH'],
  ['DELETE_PRODUCT', '/product/:productId', 'DELETE'],
  ['GET_ALL_BANNERS', '/banner', 'GET'],
  ['ADD_BANNER', '/banner', 'POST'],
  ['UPDATE_BANNER', '/banner/:bannerId', 'PATCH'],
  ['DELETE_BANNER', '/banner/:bannerId', 'DELETE'],
  ['ACTIVATE_BANNER', '/banner/:bannerId/activate', 'PATCH'],
  ['INACTIVATE_BANNER', '/banner/:bannerId/inactivate', 'PATCH'],
  ['ADD_BRAND', '/brand', 'POST'],
  ['UPDATE_BRAND', '/brand/:brandId', 'PATCH'],
  ['DELETE_BRAND', '/brand/:brandId', 'DELETE'],
  ['ADD_COUPON', '/coupon', 'POST'],
  ['UPDATE_COUPON', '/coupon/:couponId', 'PATCH'],
  ['DELETE_COUPON', '/coupon/:couponId', 'DELETE'],
];

const table = document.getElementById('table');

Routes.forEach((route) => {
  let tr = document.createElement('tr');
  let trContent = `            <td>${route[0]}</td>
  <td>${route[1]}</td>
  <td>${route[2]}</td>
  <td></td>
  <td></td>
  `;
  tr.innerHTML = trContent;
  table.appendChild(tr);
});
