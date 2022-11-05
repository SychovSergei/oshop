export interface IdentificationDialog {
  title?: string;
  dialogName: AuthDialogName;
}

export type AuthDialogName = 'login' | 'register' | 'resetPassword';
