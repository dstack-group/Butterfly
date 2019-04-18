/**
 * Deletes the user contact associated to the user identified by the given
 * email and linked to the given contact service name.
 */
SELECT ${schema~}.delete_user_contact(
  ${userEmail},
  ${contactService}
) AS "count";
