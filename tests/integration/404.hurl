GET http://localhost:8080/not-real

# We should get back an HTTP 1.1 404 response
HTTP/1.1 404
# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with { "status": "error", ... }
jsonpath "$.status" == "error"
