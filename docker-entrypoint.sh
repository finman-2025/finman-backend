#!/bin/bash

npx prisma db push

npm run seed

exec "$@"