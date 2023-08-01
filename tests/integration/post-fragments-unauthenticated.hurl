# tests/integration/post-fragments-unauthenticated.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
unknown@email.com:unknownpassword
# Body of the request goes in ```...``` when it's a string
`This fragment should not be posted as unauthenticated`

# 1. We expect to get back an HTTP 401 (Unauthorized) error
HTTP/1.1 401
