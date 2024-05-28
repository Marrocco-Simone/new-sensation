import Swal, {
  SweetAlertIcon,
  SweetAlertInput,
  SweetAlertResult,
} from 'sweetalert2';

export default function waitForConfirmSwal(
  title: string,
  confirmButtonText: string,
  callback: (result?: SweetAlertResult<any>) => void,
  html?: string,
  icon?: SweetAlertIcon,
  input?: SweetAlertInput,
  inputValue?: number,
  inputPlaceholder?: string
) {
  Swal.fire({
    // title: `Sei sicuro di voler eliminare ${a.surname} ${a.name}?`,
    title,
    html,
    input,
    inputValue,
    inputPlaceholder,
    icon: icon ?? 'question',
    showDenyButton: true,
    confirmButtonText,
    denyButtonText: `Cancel`,
    didOpen: () => {
      Swal.showLoading();
      setTimeout(() => {
        Swal.hideLoading();
      }, 0);
    },
  }).then((result) => {
    if (result.isConfirmed) {
      callback(result);
    }
  });
}
