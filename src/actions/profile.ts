import axios, { endpoints } from 'src/lib/axios';
// ----------------------------------------------------------------------

const ENDPOINT = endpoints.profile;

// ----------------------------------------------------------------------

export async function changePassword(oldPassword: string, newPassword: string) {
  /**
   * Work on server
   */
  await axios.patch(ENDPOINT.change_password, { newPassword, oldPassword });
}
// ----------------------------------------------------------------------
type UpdatePayload = {
  name?: string;
  phone?: string;

  birthDate?: string;
  email?: string;
  avatar?: string;
  address?: string;
};
export async function updateProfile(payload: UpdatePayload) {
  /**
   * Work on server
   */
  await axios.patch(ENDPOINT.update_profile, payload);
}
