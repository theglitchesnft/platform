import toast, { ToastBar, Toaster } from 'react-hot-toast';

export function CustomToaster() {
  return (
    <Toaster
      toastOptions={{
        duration: Infinity,
        success: {
          style: {
            background: '#32533D',
            color: 'white',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#32533D',
          },
        },
        loading: {
          style: {
            background: '#4C2C72',
            color: 'white',
          },
        },

        error: {
          style: {
            background: 'white',
            color: 'red',
            border: 'red',
          },
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              <div
                aria-label="Close Notification"
                style={{ cursor: 'pointer' }}
                onClick={() => toast.dismiss(t.id)}
              >
                {icon}
              </div>
              {message}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

// toast(`Confirm Transaction In Wallet`, {
//   style: {
//     background: '#3F88C5',
//     color: 'white',
//   },
//   iconTheme: {
//     primary: '#fff',
//     secondary: '#3F88C5',
//   },
// });
