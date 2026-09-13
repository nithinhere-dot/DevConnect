#!/bin/bash

BASE_URL="http://localhost:3000/api/auth"

echo "=== 1. Signup ==="
curl -X POST $BASE_URL/ \
  -H "Content-Type: application/json" \
  -d '{"displayname":"testuser","email":"nithin@test.com","password":"123456"}'

echo -e "\n\n=== 2. Signup again (should fail - duplicate email) ==="
curl -X POST $BASE_URL/ \
  -H "Content-Type: application/json" \
  -d '{"displayname":"testuser","email":"test@test.com","password":"123456"}'

echo -e "\n\n=== 3. Signup with short password (should fail) ==="
curl -X POST $BASE_URL/ \
  -H "Content-Type: application/json" \
  -d '{"displayname":"testuser2","email":"test2@test.com","password":"123"}'

echo -e "\n\n=== 4. Login (correct credentials) ==="
curl -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

echo -e "\n\n=== 5. Login (wrong password, should fail) ==="
curl -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrongpass"}'

echo -e "\n\n=== 6. Profile (no token, should fail with 401) ==="
curl -X GET $BASE_URL/profile

echo -e "\n\n=== 7. Login and capture token ==="
TOKEN=$(curl -s -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nithin@test.com","password":"123456"}' | jq -r '.token')

echo "Captured token: $TOKEN"

echo -e "\n\n=== 8. Profile (with valid token) ==="
curl -X GET $BASE_URL/profile \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n=== Done ==="