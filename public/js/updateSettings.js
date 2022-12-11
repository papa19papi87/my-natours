import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUperCase()} updated successfully! `);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
// export const updateSettings = async (name, email) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
//       data: {
//         name,
//         email,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', `${type.toUperCase()} updated successfully! `);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
