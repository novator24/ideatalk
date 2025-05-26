update
  "User"
set
  email = concat(nick, '@example.com')
where
  email is null;

