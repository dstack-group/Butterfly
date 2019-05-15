/**
 * Updates the user that matches the given email and returns the updated record.
 */
SELECT *
FROM public.update_user_contact(
  ${userEmail},
  ${contactService},
  ${contactRef}
);
