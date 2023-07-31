# CLASS PASS BACKEND

## PREREQUISITE

1. node 18 

## API ENDPOINTS

1. GET /health
2. POST /api/parse --data '{ "yelp_url" : "https://www.yelp.com/biz/crunch-fitness-san-mateo-san-mateo-2" }'


## LOCAL SETUP

### STEPS
1. **create a folder**
```sh
  mkdir classpass_backend
```

2. **goto that folder**
```sh
  cd classpass_backend
```

3. **git clone**
```sh
  git clone https://github.com/Haris487/classpass.git .
```

4. **switch node version to 18**
```sh
  nvm use 18
```

5. **npm install**
```sh
  npm install
```

7. **start server**
```sh
  npm start
```

## RUN TESTS

```sh
  npm test
```


## Deployment on server

### STEPS

1. **ssh into server**
```sh
  ssh -i "**-*******-***.pem" ubuntu@ec2-**-***-**-*.compute-1.amazonaws.com
```

2. **goto classpass directory**
```sh
  cd classpass/
```

3. **remove local changes**
```sh
  git stash
```

4. **pull latest changes**
```sh
  git pull orgin main
```

5. **install packages**
```sh
  npm install
```

6. **restart pm2 server**
```sh
  pm2 restart classpass
```

7. **check pm2 logs**
```sh
  pm2 logs
```


## ADDITIONAL DOCUMENTATIONS

1. CHEERIO Docs https://cheerio.js.org/docs/intro
