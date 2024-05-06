import Swal from 'sweetalert2';
import { ApiResponse } from '../services/api';
import { ApiError, ApiResult } from '../services/api/api';
import wrapAsyncFunInWaitingSwal from './wrapAsyncFunInWaitingSwal';

export default function wrapApiCallInWaitingSwal<T>(
  apiFn: () => Promise<ApiResponse<T>>,
  successCallback: (response: ApiResult<T>) => void,
  errorCallback?: (response: ApiError) => void
) {
  wrapAsyncFunInWaitingSwal(apiFn, (response) => {
    if (response.status !== 'success') {
      console.error(response.message);
      errorCallback?.(response);
      Swal.fire({
        icon: 'error',
        title: "Qualcosa &eacute; andato storto",
        html: `${response.message}`,
      });
    } else {
      successCallback(response);
    }
  });
}
